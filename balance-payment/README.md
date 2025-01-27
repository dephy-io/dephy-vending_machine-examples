# Balance Payment Program

This project is a Solana program built using the Anchor framework.
It allows users to deposit, withdraw, lock, and settle funds, as well as make payments to a treasury account.
The program is designed to be used in conjunction with a bot and a treasury account, which are managed by an authority.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://project-serum.github.io/anchor/getting-started/installation.html)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dephy-io/balance-payment.git
   cd balance-payment/balance-payment
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Compiling the Program

To compile the program, run:

```bash
anchor build
```

This command compiles the Solana program and generates the necessary artifacts.

## Testing the Program

To run the tests, use the following command:

```bash
anchor test
```

## Deploying the Program Locally

To deploy the program to a local Solana validator, follow these steps:

1. **Start a local Solana validator:**

   ```bash
   solana-test-validator
   ```

   This command starts a local Solana blockchain instance.

2. **Ensure your Solana CLI is configured to use the local validator:**

   ```bash
   solana config set --url http://localhost:8899
   ```

3. **Airdrop SOL to your local wallet:**

   ```bash
   solana airdrop 10
   ```

4. **Deploy the program to the local validator:**

   ```bash
   solana program deploy ./target/deploy/balance_payment.so --program-id ./programs/balance-payment/keypair.json
   ```

   This command will deploy the program to the local Solana validator and output the program ID.

# Initialize the Program

Initializes the program with an authority, treasury, and bot.

```bash
anchor run cli -- initialize --authority <AUTHORITY_PUBKEY> --treasury <TREASURY_PUBKEY> --bot <BOT_PUBKEY>
```

- `--authority`: The public key of the authority.
- `--treasury`: The public key of the treasury account.
- `--bot`: The public key of the bot account.

# App Demo

The `app` folder contains a demo application that interacts with the Balance Payment program. To run the demo:

- Navigate to the `app` directory:
  ```bash
  cd app
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the development server:
  ```bash
  npm run dev
  ```
- Open your browser and navigate to `http://localhost:5173` to view the demo.

This demo provides a user-friendly interface to interact with the Balance Payment program, enabling users to manage funds and simulate charging sessions.
