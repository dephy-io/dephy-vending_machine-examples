# dephy-decharge-controller

## Run by Docker Compose

```bash
# At the root file of this repository.
docker compose up
```

## Run manually

### Prepare

In this example, you should have a [dephy messaging network](https://github.com/dephy-io/dephy-messaging-network-self-hosted/tree/main/dephy-messaging-network) running on `ws://127.0.0.1:8000`.
You can modify `--nostr-relay` if it is running on a different address.

### Run Server

The schema of the database is in [migrations](./migrations/).

You can migrate it by [sqlx-cli](https://crates.io/crates/sqlx-cli) or enable those sql manually. To migrate it by sqlx-cli:

```shell
sqlx database create --database-url postgresql://<username:<password>>@<address>/<db>
sqlx migrate run --database-url postgresql://<username>:<password>@<address>/<db>
```

The server need your solana keypair.

```shell
mkdir data
# copy your keypair to data/solana-keypair
```

To run the server:

```shell
cargo run --bin dephy-decharge-controller-server -- --nostr-relay ws://127.0.0.1:8000 --key <key> --pg-url postgresql://<username>:<password>@<address>/<db>
```

### Run Node (this is on charger equipment side)

The node need your solana keypair.

```shell
mkdir data
# copy your keypair to data/solana-keypair
```

```shell
cargo run --bin dephy-decharge-controller-node -- --nostr-relay ws://127.0.0.1:8000 --machine-pubkeys d041ea9854f2117b82452457c4e6d6593a96524027cd4032d2f40046deb78d93 --admin-pubkey <pubkey of server>
```

### Cli Example (it simulates a charging process)

```shell
cargo run --example cli -- --nostr-relay ws://127.0.0.1:8000 --machine-pubkey d041ea9854f2117b82452457c4e6d6593a96524027cd4032d2f40046deb78d93 --user <user solana address> --nonce <nonce of recover info> --recover-info <recover info>
```
