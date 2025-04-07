# DePHY vending machine examples

This is a vending machine showcase for DePHY Messaging Layer.

## Online demo

The program has deployed to Solana devnet, address: `8Pna6CZRquk83XT6ecisT9TYVfN3hY299GH2yEJk73dL`

See <https://balance-payment.pages.dev/examples> for the dApp

## How it works

![](./doc/architecture.png)

## Repo contents

- [Solana program and dApp](./balance-payment)
  - [dApp](./balance-payment/app)
- [Pre-generated program Rust SDK](./balance-payment-sdk)
- Examples
  - [DeCharge](./examples/decharge-controller)
  - [Gacha](./examples/gacha-controller)

## Run from source

1. [Run DePHY messaging network](https://github.com/dephy-io/dephy-messaging-network-self-hosted/tree/main/dephy-messaging-network)
2. Run DePHY vending machine workers by: `docker compose up`
3. [Deploy the Solana program and run the dApp](./balance-payment/README.md)

## TODO

- Build a scripts to quick deploy a local demo
- Rename DeCharge things to vending machine
- Rich docs

## Future works

- Use an offchain account book to ensure the process transactionality
- Indexer and a dashboard dAPP for showing order history

## License

MIT
