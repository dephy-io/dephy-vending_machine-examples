import * as anchor from "@coral-xyz/anchor";
import * as ed from "@noble/ed25519";
import { web3, Program, BN } from "@coral-xyz/anchor";
import { BalancePayment } from "../target/types/balance_payment";
import { Command } from "commander";
import { Keypair } from "@solana/web3.js";
import { v4 as uuidv4 } from "uuid";
import keccak from "keccak";
import { readFileSync } from "fs";
import bs58 from "bs58";
import os from "os";
import path from "path";

const getSignMessagePrefix = (namespaceName: string) => `DePHY vending machine/${namespaceName}:\n`;

const cli = new Command();

let provider: anchor.AnchorProvider;
const getBalancePaymentProgram = () => {
  provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  return anchor.workspace.BalancePayment as Program<BalancePayment>;
};

type Methods = anchor.Program<BalancePayment>["methods"];

const execute = async (tx: ReturnType<Methods[keyof Methods]>) => {
  const pubkeys = await tx.pubkeys();
  for (const [name, key] of Object.entries(pubkeys)) {
    console.log(name, key.toBase58());
  }
  const signature = await tx.rpc();
  console.log("signature", signature);
  return { signature, pubkeys };
};

const sol = (n: number | string) => {
  return new BN(Number(n) * web3.LAMPORTS_PER_SOL);
};

const showObj = (
  obj: { [_: string]: web3.PublicKey | BN | any },
  indent = 0
) => {
  const padding = " ".repeat(indent);
  for (const [k, v] of Object.entries(obj)) {
    if (BN.isBN(v)) {
      console.log(padding, k, v.toNumber());
    } else if (v?.toBase58) {
      console.log(padding, k, v.toBase58());
    } else if (v && typeof v === "object") {
      console.log(padding, k);
      showObj(v, indent + 2);
    } else {
      console.log(padding, k, v);
    }
  }
};

const getUserKeypair = (keypairPath?: string): Keypair => {
  // Default path: ~/.config/solana/id.json
  const defaultPath = path.join(os.homedir(), ".config", "solana", "id.json");
  const resolvedPath = keypairPath || defaultPath;

  try {
    const keypairFile = readFileSync(resolvedPath, "utf-8");
    const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(keypairFile)));
    return keypair;
  } catch (error) {
    throw new Error(
      `Failed to load keypair from ${resolvedPath}: ${error.message}`
    );
  }
};

const generate64ByteUUID = (): Buffer => {
  const uuid = uuidv4().replace(/-/g, "");
  const uuidBuffer = Buffer.from(uuid, "hex");
  const extendedBuffer = Buffer.concat([uuidBuffer, Buffer.alloc(48, 0)]);
  return extendedBuffer;
};

const getNonce = async (user: web3.PublicKey): Promise<BN> => {
  const balancePayment = getBalancePaymentProgram();
  const userAccountPubkey = getUserAccountPubkey(user);
  const userAccount = await balancePayment.account.userAccount.fetch(
    userAccountPubkey
  );
  return userAccount.nonce;
};

const getUserAccountPubkey = (user: web3.PublicKey) => {
  const [userAccountPubkey, _] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("USER"), user.toBuffer()],
    anchor.workspace.BalancePayment.programId
  );
  return userAccountPubkey;
};

cli.name("cli");

cli.command("initialize").action(async (opt) => {
  const payfiPool = getBalancePaymentProgram();
  const tx = payfiPool.methods.initialize().accountsPartial({});
  await execute(tx);
});

cli
  .command("create_namespace")
  .requiredOption("--name <name>", "String")
  .requiredOption("--authority <authority>", "Pubkey")
  .requiredOption("--treasury <treasury>", "Pubkey")
  .requiredOption("--bot <bot>", "Pubkey")
  .action(async (opt) => {
    const payfiPool = getBalancePaymentProgram();
    const tx = payfiPool.methods.createNamespace(opt.name).accountsPartial({
      authority: new web3.PublicKey(opt.authority),
      treasury: new web3.PublicKey(opt.treasury),
      bot: new web3.PublicKey(opt.bot),
    });
    await execute(tx);
  });

cli.command("register").action(async () => {
  const balancePayment = getBalancePaymentProgram();
  const user = provider.publicKey;
  const tx = balancePayment.methods.register().accountsPartial({
    user,
  });
  await execute(tx);
});

cli
  .command("deposit")
  .requiredOption("--amount <amount>", "Amount in SOL")
  .action(async (opt) => {
    const balancePayment = getBalancePaymentProgram();
    const user = provider.publicKey;
    const amount = sol(opt.amount);
    const tx = balancePayment.methods.deposit(amount).accountsPartial({
      user,
    });
    await execute(tx);
  });

cli
  .command("withdraw")
  .requiredOption("--amount <amount>", "Amount in SOL")
  .action(async (opt) => {
    const balancePayment = getBalancePaymentProgram();
    const user = provider.publicKey;
    const amount = sol(opt.amount);
    const tx = balancePayment.methods.withdraw(amount).accountsPartial({
      user,
    });
    await execute(tx);
  });

cli
  .command("sign_message")
  .requiredOption("--namespace_id <namespace_id>", "Number")
  .requiredOption("--minutes <minutes>", "Minutes until deadline")
  .option(
    "--keypair <keypair>",
    "Path to keypair file (default: ~/.config/solana/id.json)"
  )
  .action(async (opt) => {
    const balancePayment = getBalancePaymentProgram();

    // Get user's keypair
    const userKeypair = getUserKeypair(opt.keypair);
    const user = userKeypair.publicKey; // Use the public key from the provided keypair

    // Log the user who is signing
    console.log("Signing user:", user.toBase58());

    // Get nonce from user account
    const nonce = await getNonce(user);

    const namespaceId = new BN(opt.namespace_id);

    // Convert minutes to deadline (current timestamp + minutes * 60 seconds)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const deadline = new BN(currentTimestamp + Number(opt.minutes) * 60);

    // Generate extraData
    const extraData = generate64ByteUUID();

    // Create message
    const message = Buffer.concat([
      extraData,
      namespaceId.toArrayLike(Buffer, "le", 8),
      nonce.toArrayLike(Buffer, "le", 8),
      deadline.toArrayLike(Buffer, "le", 8),
    ]);

    const [namespaceAccountPubkey, _] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("NAMESPACE"), namespaceId.toArrayLike(Buffer, "le", 8)],
      anchor.workspace.BalancePayment.programId
    );

    const namespaceAccount =
      await balancePayment.account.namespaceAccount.fetch(
        namespaceAccountPubkey
      );

    const signMessagePrefix = getSignMessagePrefix(namespaceAccount.name)

    // Hash the message and generate digest
    const messageHash = keccak("keccak256").update(message).digest();
    const hashedMessageBase58 = bs58.encode(messageHash);
    const digest = new TextEncoder().encode(
      `${signMessagePrefix}${hashedMessageBase58}`
    );

    // Get user's private key
    const privateKey = userKeypair.secretKey.slice(0, 32); // First 32 bytes are the private key

    // Sign the message
    const signature = await ed.signAsync(digest, privateKey);

    // Create recoverInfo
    const recoverInfo = {
      signature: Array.from(signature),
      extra_data: Array.from(extraData),
      deadline,
    };

    // Output recoverInfo as JSON
    const jsonString = JSON.stringify(recoverInfo);
    console.log("Recover Info (JSON):", jsonString);

    const base64String = Buffer.from(jsonString).toString("base64");
    console.log("Recover Info (Base64)", base64String);
  });

cli
  .command("lock")
  .requiredOption("--namespace_id <namespace_id>", "Number")
  .requiredOption("--user <user>", "User Pubkey")
  .requiredOption("--amount <amount>", "Amount in SOL")
  .requiredOption("--recoverInfo <recoverInfo>", "Recover Info (Base64)")
  .action(async (opt) => {
    const balancePayment = getBalancePaymentProgram();
    const user = new web3.PublicKey(opt.user);
    const amount = sol(opt.amount);
    const recoverInfo = JSON.parse(
      Buffer.from(opt.recoverInfo, "base64").toString()
    );

    recoverInfo.signature = Array.from(recoverInfo.signature);
    recoverInfo.extra_data = Array.from(recoverInfo.extra_data);
    recoverInfo.deadline = new BN(recoverInfo.deadline, "hex");

    const namespaceId = new BN(opt.namespace_id);

    const [namespaceAccountPubkey, _] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("NAMESPACE"), namespaceId.toArrayLike(Buffer, "le", 8)],
      anchor.workspace.BalancePayment.programId
    );

    const namespaceAccount =
      await balancePayment.account.namespaceAccount.fetch(
        namespaceAccountPubkey
      );

    const tx = balancePayment.methods
      .lock(namespaceId, recoverInfo, amount)
      .accountsPartial({
        user,
        bot: namespaceAccount.bot,
      });
    await execute(tx);
  });

cli
  .command("settle")
  .requiredOption("--user <user>", "User Pubkey")
  .requiredOption("--nonce <nonce>", "Nonce")
  .requiredOption("--amountToTransfer <amountToTransfer>", "Amount in SOL")
  .action(async (opt) => {
    const balancePayment = getBalancePaymentProgram();
    const user = new web3.PublicKey(opt.user);
    const nonce = new BN(opt.nonce);
    const amountToTransfer = sol(opt.amountToTransfer);

    const [lockAccountPubkey] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("LOCK"),
        user.toBuffer(),
        nonce.toArrayLike(Buffer, "le", 8),
      ],
      balancePayment.programId
    );

    const lockAccount =
      await balancePayment.account.lockAccount.fetch(
        lockAccountPubkey
      );

    const [namespaceAccountPubkey] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("NAMESPACE"), lockAccount.namespaceId.toArrayLike(Buffer, "le", 8)],
      anchor.workspace.BalancePayment.programId
    );

    const namespaceAccount =
      await balancePayment.account.namespaceAccount.fetch(
        namespaceAccountPubkey
      );

    const tx = balancePayment.methods
      .settle(nonce, amountToTransfer)
      .accountsPartial({
        user,
        treasury: namespaceAccount.treasury,
        bot: namespaceAccount.bot,
      });
    await execute(tx);
  });

cli
  .command("pay")
  .requiredOption("--namespace_id <namespace_id>", "Number")
  .requiredOption("--user <user>", "User Pubkey")
  .requiredOption("--amountToTransfer <amountToTransfer>", "Amount in SOL")
  .requiredOption("--recoverInfo <recoverInfo>", "Recover Info (Base64)")
  .action(async (opt) => {
    const balancePayment = getBalancePaymentProgram();
    const user = new web3.PublicKey(opt.user);
    const amountToTransfer = sol(opt.amountToTransfer);
    const recoverInfo = JSON.parse(
      Buffer.from(opt.recoverInfo, "base64").toString()
    );

    recoverInfo.signature = Array.from(recoverInfo.signature);
    recoverInfo.extra_data = Array.from(recoverInfo.extra_data);
    recoverInfo.deadline = new BN(recoverInfo.deadline, "hex");

    const namespaceId = new BN(opt.namespace_id);

    const [namespaceAccountPubkey, _] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("NAMESPACE"), namespaceId.toArrayLike(Buffer, "le", 8)],
      anchor.workspace.BalancePayment.programId
    );

    const namespaceAccount =
      await balancePayment.account.namespaceAccount.fetch(
        namespaceAccountPubkey
      );

    const tx = balancePayment.methods
      .pay(namespaceId, recoverInfo, amountToTransfer)
      .accountsPartial({
        user,
        treasury: namespaceAccount.treasury,
        bot: namespaceAccount.bot,
      });
    await execute(tx);
  });

cli.command("show_global").action(async () => {
  const balancePayment = getBalancePaymentProgram();
  const [globalAccountPubkey, _] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GLOBAL")],
    balancePayment.programId
  );
  const globalAccount = await balancePayment.account.globalAccount.fetch(
    globalAccountPubkey
  );
  showObj(globalAccount);
});

cli.command("show_namespaces").action(async () => {
  const balancePayment = getBalancePaymentProgram();
  const allNamespaces = await balancePayment.account.namespaceAccount.all();

  allNamespaces.forEach((user) => {
    showObj(user);
    console.log("-".repeat(50));
  });
});

cli.command("show_users").action(async () => {
  const balancePayment = getBalancePaymentProgram();
  const allUsers = await balancePayment.account.userAccount.all();

  allUsers.forEach((user) => {
    showObj(user);
    console.log("-".repeat(50));
  });
});

cli.parse();
