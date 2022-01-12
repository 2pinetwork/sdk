import { Wallet } from 'ethers'
import { getVaults, Vault } from './vaults'
import { deposit } from './helpers/deposit'
import { faucet } from './helpers/faucet'
import { TransactionsResponse } from './helpers/transaction'
import { withdraw } from './helpers/withdraw'

type Constructor = {
  mnemonic?:  string,
  path?:      string,
  apiKey?:    string,
  apiSecret?: string,
  endpoint?:  string
}

type Deposit = {
  amount:          string
  vaultIdentifier: 'mumbai_dai'
  unit:            'native' | 'wei' | undefined
  referrer?:       string
}

type Withdraw = {
  amount:          string
  vaultIdentifier: 'mumbai_dai'
  unit:            'native' | 'wei' | undefined
}

type Faucet = {
  network: 'polygon'
  address: string
}

export default class TwoPi {
  readonly mnemonic?:  string
  readonly path?:      string
  readonly address?:   string
  readonly apiKey?:    string
  readonly apiSecret?: string
  readonly endpoint:   string
  readonly wallet?:    Wallet

  constructor({ mnemonic, path, apiKey, apiSecret, endpoint }: Constructor) {
    this.mnemonic  = mnemonic
    this.path      = path
    this.wallet    = mnemonic ? Wallet.fromMnemonic(mnemonic, path) : undefined
    this.address   = this.wallet?.address
    this.apiKey    = apiKey
    this.apiSecret = apiSecret
    this.endpoint  = endpoint || 'https://api.2pi.network'
  }

  async getVaults(): Promise<Array<Vault>> {
    return await getVaults(this)
  }

  async deposit({
    amount,
    vaultIdentifier,
    unit,
    referrer
  }: Deposit): TransactionsResponse {
    return await deposit(this, {
      amount,
      vaultIdentifier,
      referrer,
      unit: unit || 'wei'
    })
  }

  async withdraw({ amount, vaultIdentifier, unit }: Withdraw): TransactionsResponse {
    return await withdraw(this, {
      amount,
      vaultIdentifier,
      unit: unit || 'wei'
    })
  }

  async faucet({ network, address }: Faucet): TransactionsResponse {
    return await faucet(this, { network, address })
  }
}
