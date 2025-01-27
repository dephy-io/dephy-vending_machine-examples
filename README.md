DePHY vending machine examples
====

This is a vending machine showcase for DePHY Messaging Layer.

## Online demo

The program has deployed to Solana devnet, address: `GguVKxU88NUe3GLtns7Uaa6a8Pjb9USKq3WD1rjZnPS9`

See https://balance-payment.pages.dev/program for the dApp

## How it works

![](./doc/vending_machine_workflow.png)

## Repo contents

- [Solana program and dApp](./balance-payment)
  - [dApp](./balance-payment/app)
- [Pre-generated program Rust SDK](./balance-payment-sdk)
- Examples
  - [DeCharge](./examples/decharge-controller)
  - [Gacha](./examples/gacha-controller)

## Run from source

- Deploy the Solana program, see [doc](./balance-payment/README.md)
- Build and run the DePHY vending machine worker, see [doc](./examples/decharge-controller/README.md)
- Run the dApp, see [doc](./balance-payment/app/README.md)

## TODO

- Build a scripts to quick deploy a local demo
- Rename DeCharge things to vending machine
- Rich docs

## Future works

- Use an offchain account book to ensure the process transactionality
- Indexer and a dashboard dAPP for showing order history

## License

MIT
