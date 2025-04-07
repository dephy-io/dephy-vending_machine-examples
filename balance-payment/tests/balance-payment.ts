import * as anchor from "@coral-xyz/anchor";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import { v4 as uuidv4 } from "uuid";
import { BalancePayment } from "../target/types/balance_payment";
import { assert } from "chai";
import keccak from "keccak";
import * as ed from "@noble/ed25519";
import bs58 from "bs58";

const getSignMessagePrefix = (namespaceName: string) =>
  `DePHY vending machine/${namespaceName}:\n`;

const sol = function (n: number) {
  return new BN(n * web3.LAMPORTS_PER_SOL);
};

describe("balance-payment", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BalancePayment as Program<BalancePayment>;

  const authority = web3.Keypair.generate();
  const treasury = web3.Keypair.generate();
  const bot = web3.Keypair.generate();

  const user = web3.Keypair.generate();

  const myTestNamespaceId = new BN(0);

  const depositAmount = sol(50);
  const withdrawAmount = sol(1);

  const [globalAccountPubkey, _] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GLOBAL")],
    anchor.workspace.BalancePayment.programId
  );

  const getNamespaceAccountPubkey = (namespaceId: BN) => {
    const [namespaceAccountPubkey, _] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("NAMESPACE"), namespaceId.toArrayLike(Buffer, "le", 8)],
      anchor.workspace.BalancePayment.programId
    );
    return namespaceAccountPubkey;
  };

  const getUserAccountPubkey = (user: web3.PublicKey) => {
    const [userAccountPubkey, _] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("USER"), user.toBuffer()],
      anchor.workspace.BalancePayment.programId
    );
    return userAccountPubkey;
  };

  const getUserVaultPubkey = (user: web3.PublicKey) => {
    const [vaultPubkey, _] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("VAULT"), user.toBuffer()],
      anchor.workspace.BalancePayment.programId
    );
    return vaultPubkey;
  };

  const getLockAccountPubkey = (user: web3.PublicKey, nonce: BN) => {
    const [lockAccountPubkey, _] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("LOCK"),
        user.toBuffer(),
        nonce.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    return lockAccountPubkey;
  };

  const generate64ByteUUID = (): Buffer => {
    const uuid = uuidv4().replace(/-/g, ""); // 去掉连字符
    const uuidBuffer = Buffer.from(uuid, "hex");

    const extendedBuffer = Buffer.concat([uuidBuffer, Buffer.alloc(48, 0)]);

    return extendedBuffer;
  };
  const airdrop = async (to: web3.PublicKey, amount: BN) => {
    await anchor.Native.system()
      .methods.transfer(amount)
      .accounts({ to })
      .rpc();
  };

  before(async () => {
    await airdrop(user.publicKey, sol(100));
  });

  it("initialize", async () => {
    const tempTreasury = web3.Keypair.generate().publicKey;
    const tempBot = web3.Keypair.generate().publicKey;
    const { signature } = await program.methods
      .initialize()
      .accountsPartial({})
      .rpcAndKeys();
    console.log("initialize:", signature);

    const global = await program.account.globalAccount.fetch(
      globalAccountPubkey
    );
    assert.equal(global.namespaceNonce.toNumber(), 0);
  });

  it("create namespace", async () => {
    const tempTreasury = web3.Keypair.generate().publicKey;
    const tempBot = web3.Keypair.generate().publicKey;
    const { signature } = await program.methods
      .createNamespace("My Test")
      .accountsPartial({
        authority: authority.publicKey,
        treasury: tempTreasury,
        bot: tempBot,
      })
      .rpcAndKeys();
    console.log("create_namespace:", signature);

    const namespace = await program.account.namespaceAccount.fetch(
      getNamespaceAccountPubkey(myTestNamespaceId)
    );

    assert.equal(
      namespace.authority.toString(),
      authority.publicKey.toString()
    );
    assert.equal(namespace.treasury.toString(), tempTreasury.toString());
    assert.equal(namespace.bot.toString(), tempBot.toString());
  });

  it("update namespace", async () => {
    const { signature } = await program.methods
      .updateNamespace(myTestNamespaceId, null, null, bot.publicKey, treasury.publicKey)
      .accountsPartial({
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpcAndKeys();
    console.log("update_namespace:", signature);

    const namespace = await program.account.namespaceAccount.fetch(
      getNamespaceAccountPubkey(myTestNamespaceId)
    );

    assert.equal(namespace.bot.toString(), bot.publicKey.toString());
    assert.equal(namespace.treasury.toString(), treasury.publicKey.toString());
  });

  it("register", async () => {
    const { signature } = await program.methods
      .register()
      .accountsPartial({
        user: user.publicKey,
      })
      .signers([user])
      .rpcAndKeys();
    console.log("register:", signature);

    const userAccountPubkey = getUserAccountPubkey(user.publicKey);
    const userAccount = await program.account.userAccount.fetch(
      userAccountPubkey
    );
    assert.equal(
      userAccount.vault.toString(),
      getUserVaultPubkey(user.publicKey).toString()
    );
  });

  it("deposit", async () => {
    const { signature } = await program.methods
      .deposit(depositAmount)
      .accountsPartial({
        user: user.publicKey,
      })
      .signers([user])
      .rpcAndKeys();
    console.log("deposit:", signature);

    const userVaultPubkey = getUserVaultPubkey(user.publicKey);
    const userVaultBalance = await program.provider.connection.getBalance(
      userVaultPubkey
    );

    assert(depositAmount.eq(new BN(userVaultBalance)));
  });

  it("withdraw", async () => {
    const { signature } = await program.methods
      .withdraw(withdrawAmount)
      .accountsPartial({
        user: user.publicKey,
      })
      .signers([user])
      .rpcAndKeys();
    console.log("withdraw:", signature);

    const userVaultPubkey = getUserVaultPubkey(user.publicKey);
    const userVaultBalance = await program.provider.connection.getBalance(
      userVaultPubkey
    );

    const remainingAmount = depositAmount.sub(withdrawAmount);

    assert(remainingAmount.eq(new BN(userVaultBalance)));
  });

  it("lock", async () => {
    const amount = sol(10);

    const userAccountPubkey = getUserAccountPubkey(user.publicKey);

    let userAccount = await program.account.userAccount.fetch(
      userAccountPubkey
    );

    const nonce = userAccount.nonce;
    const extraData = generate64ByteUUID();

    const deadline = new BN(Date.now() / 1000 + 60 * 30); // 30 minutes later
    const message = Buffer.concat([
      extraData,
      myTestNamespaceId.toArrayLike(Buffer, "le", 8),
      nonce.toArrayLike(Buffer, "le", 8),
      deadline.toArrayLike(Buffer, "le", 8),
    ]);

    const namespace = await program.account.namespaceAccount.fetch(
      getNamespaceAccountPubkey(myTestNamespaceId)
    );

    const signMessagePrefix = getSignMessagePrefix(namespace.name);

    const messageHash = keccak("keccak256").update(message).digest();
    const hashedMessageBase58 = bs58.encode(messageHash);
    const digest = new TextEncoder().encode(
      `${signMessagePrefix}${hashedMessageBase58}`
    );

    const privateKey = user.secretKey.slice(0, 32);

    const signature = await ed.signAsync(digest, privateKey);

    const recoverInfo = {
      signature: Array.from(signature),
      extraData: Array.from(extraData),
      deadline,
    };

    const { signature: txSignature } = await program.methods
      .lock(myTestNamespaceId, recoverInfo, amount)
      .accountsPartial({
        user: user.publicKey,
        bot: bot.publicKey,
      })
      .signers([bot])
      .rpcAndKeys();

    console.log("lock:", txSignature);

    const lockAccountPubkey = getLockAccountPubkey(user.publicKey, nonce);
    const lockAccount = await program.account.lockAccount.fetch(
      lockAccountPubkey
    );
    assert.equal(
      lockAccount.namespaceId.toString(),
      myTestNamespaceId.toString()
    );
    assert.equal(lockAccount.amount.toString(), amount.toString());

    userAccount = await program.account.userAccount.fetch(userAccountPubkey);
    assert(userAccount.lockedAmount.eq(amount));
  });

  it("settle", async () => {
    const nonce = new BN(0);
    const amountToTransfer = sol(5);

    const { signature } = await program.methods
      .settle(nonce, amountToTransfer)
      .accountsPartial({
        user: user.publicKey,
        treasury: treasury.publicKey,
        bot: bot.publicKey,
      })
      .signers([bot])
      .rpcAndKeys();

    console.log("settle:", signature);

    const treasuryBalance = await program.provider.connection.getBalance(
      treasury.publicKey
    );
    assert.equal(treasuryBalance, amountToTransfer.toNumber());

    const lockAccountPubkey = getLockAccountPubkey(user.publicKey, nonce);

    try {
      await program.account.lockAccount.fetch(lockAccountPubkey);
    } catch (error) {
      assert(error.message.includes("Account does not exist"));
    }

    const userAccountPubkey = getUserAccountPubkey(user.publicKey);
    const userAccount = await program.account.userAccount.fetch(
      userAccountPubkey
    );
    assert(userAccount.lockedAmount.eq(new BN(0)));
  });

  it("pay", async () => {
    const amountToTransfer = sol(1);

    const userAccountPubkey = getUserAccountPubkey(user.publicKey);

    let userAccount = await program.account.userAccount.fetch(
      userAccountPubkey
    );

    const nonce = userAccount.nonce;
    const extraData = generate64ByteUUID();

    const deadline = new BN(Date.now() / 1000 + 60 * 30); // 30 minutes later
    const message = Buffer.concat([
      extraData,
      myTestNamespaceId.toArrayLike(Buffer, "le", 8),
      nonce.toArrayLike(Buffer, "le", 8),
      deadline.toArrayLike(Buffer, "le", 8),
    ]);

    const namespace = await program.account.namespaceAccount.fetch(
      getNamespaceAccountPubkey(myTestNamespaceId)
    );

    const signMessagePrefix = getSignMessagePrefix(namespace.name);

    const messageHash = keccak("keccak256").update(message).digest();
    const hashedMessageBase58 = bs58.encode(messageHash);
    const digest = new TextEncoder().encode(
      `${signMessagePrefix}${hashedMessageBase58}`
    );

    const privateKey = user.secretKey.slice(0, 32);

    const signature = await ed.signAsync(digest, privateKey);

    const recoverInfo = {
      signature: Array.from(signature),
      extraData: Array.from(extraData),
      deadline,
    };

    const vaultBalanceBefore = await program.provider.connection.getBalance(
      userAccount.vault
    );

    const { signature: txSignature } = await program.methods
      .pay(myTestNamespaceId, recoverInfo, amountToTransfer)
      .accountsPartial({
        user: user.publicKey,
        treasury: treasury.publicKey,
        bot: bot.publicKey,
      })
      .signers([bot])
      .rpcAndKeys();

    console.log("pay:", txSignature);

    const vaultBalanceAfter = await program.provider.connection.getBalance(
      userAccount.vault
    );

    assert.equal(
      vaultBalanceBefore - vaultBalanceAfter,
      amountToTransfer.toNumber()
    );
  });
});
