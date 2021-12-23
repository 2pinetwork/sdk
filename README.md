# Welcome to 2PI SDK

JavaScript SDK for building with 2PI Protocol

* [Homepage](https://2pi.network)
* [Docs](https://docs.2pi.network)

# Installation

## Using yarn

```console
yarn add @2pi-network/sdk
```

## Using npm

```console
npm i @2pi-network/sdk
```

# Usage

Here is a quick look at using the SDK. This assume you have some environment variables:

* MNEMONIC: this should contain a valid [mnemonic](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).
* API_KEY: API key value.
* API_SECRET: API secret value.

```js
const { TwoPi } = require('@2pi-network/sdk')

const main = async () => {
  const mnemonic  = process.env.MNEMONIC
  const apiKey    = process.env.API_KEY
  const apiSecret = process.env.API_SECRET
  const twoPi     = new TwoPi({ mnemonic, apiKey, apiSecret })
  const vaults    = await twoPi.getVaults()

  vaults.forEach(vault => {
    console.log('Identifier',    vault.identifier)
    console.log('PID',           vault.pid)
    console.log('Token',         vault.token)
    console.log('Address',       vault.address)
    console.log('Token address', vault.tokenAddress)
    console.log('APY',           vault.apy)
    console.log('Balances',      vault.balances)
    console.log('Deposits',      vault.deposits)
  })
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(1)
})
```

# Public classes

* [TwoPi](#twopi-instance)
  * [Attributes](#twopi-public-attributes)
  * [Methods](#twopi-public-methods)

# Private classes (may become public on future releases)

* [Vault](#vault-instance)
  * [Attributes](#vault-private-attributes)
  * [Methods](#vault-private-methods)

## TwoPi instance

This is the entry point of almost any interaction. You will be asked to provide at least 3 arguments:

* One mnemonic, this would be used to sign and send the relevant transactions.
* API key, together with API secret will be used to connect with 2PI network API.
* API secret, together with API key will be used to connect with 2PI network API.

### TwoPi public attributes

On every `twoPi` instance you can access the following attributes:

* `mnemonic`: the provided mnemonic for this instance.
* `path?`: the provided derivation path for this instance (defaults to `m/44'/60'/0'/0/0`).
* `address`: the public address derived from the provided mnemonic.
* `apiKey`: the provided API key.
* `apiSecret`: the provided API secret.
* `endpoint`: the API endpoint in use.
* `wallet`: the wallet instance, derived from the provided mnemonic.

### TwoPi public methods

* `constructor({mnemonic, path?, apiKey, apiSecret, endpoint?})` returns a new instance. Refer to [TwoPi public attributes](#twopi-public-attributes) to get a description of each argument.
* `async getVaults()` it returns an array of available vaults (each of which are Vault instances).
* `async deposit({amount, vaultIdentifier, unit?})` it makes a deposit on the given pool. For `amount` prefer string to keep precision. If `unit` is `'wei'` (default) amount would not be converted. If `unit` is `'native'` the provided amount would be interpreted like fetched directly from some UI (for example 1 for ETH would be converted to `1 * 1e18`). The `vaultIdentifier` argument can be omitted, the only (and default) options for the time being is `mumbai_dai`.
  * `status`: can be 'success' or 'error'
  * `transactions`?: array of executed transactions as [transaction receipts](https://docs.ethers.io/v5/single-page/#/v5/api/providers/types/-%23-providers-TransactionReceipt) (in case of error, the last one should have the required information to trace the reason).
  * `message`?: in case of error, the overall main reason description.
  * `cursor`?: in case of error, the index (zero based) of the failed transaction.
* `async withdraw({amount, vaultIdentifier, unit?})` it makes a withdraw on the given pool. For `amount` prefer string to keep precision. If `unit` is `'wei'` (default) amount would not be converted. If `unit` is `'native'` the provided amount would be interpreted like fetched directly from some UI (for example 1 for ETH would be converted to `1 * 1e18`). The `vaultIdentifier` argument can be omitted, the only (and default) options for the time being is `mumbai_dai`. Returns an object with the following attributes:
  * `status`: can be 'success', 'failed' or 'error'
  * `transactions`?: array of executed transactions as [transaction receipts](https://docs.ethers.io/v5/single-page/#/v5/api/providers/types/-%23-providers-TransactionReceipt) (in case of error, the last one should have the required information to trace the reason).
  * `message`?: in case of failed or error, the overall main reason description.
  * `cursor`?: in case of failed or error, the index (zero based) of the failed transaction.

### Vault private attributes

On every `vault` instance you can access the following attributes:

* `identifier`: the vault identifier, used as argument on deposit and withdraw operation (referred as `vaultIdentifier`).
* `pid`: the vault _internal_ ID.
* `token`: string identifying the token being maximized.
* `address`: string with the vault main contract address.
* `tokenAddress`: string with the vault token address.
* `apy`: the current vault [APY](https://en.wikipedia.org/wiki/Annual_percentage_yield).
* `balances`: array of the current balances of the registered wallets (represented in objects `{ wallet: string, amount: number }`).
* `deposits`: array of the current deposits of the registered wallets (represented in objects `{ wallet: string, amount: number }`).

### Vault private methods

* `constructor({identifier, pid, token, address, tokenAddress, apy, balances, deposits})` refer to [Vault private attributes](#vault-private-attributes) to get a description of each argument and attribute.

## Warning

Always be careful when storing mnemonic and API keys / secret data.

# Let's talk!

* [Join our #devs](https://discord.gg/fyc42N2d) channel on Discord!
