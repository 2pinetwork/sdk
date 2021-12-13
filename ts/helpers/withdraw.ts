import { TransactionReceipt } from '@ethersproject/abstract-provider'
import routes from './routes.json'
import { post } from './request'
import { processTransactionResponse } from './transaction'
import TwoPi from '../twoPi'

type Withdraw = {
  amount:          string,
  vaultIdentifier: 'mumbai_dai',
  unit:            'native' | 'wei'
}

export const withdraw = async (
  twoPi: TwoPi,
  { amount, vaultIdentifier, unit }: Withdraw
): Promise<Array<TransactionReceipt>> => {
  const data     = { withdraw: { amount, unit, vault_identifier: vaultIdentifier } }
  const response = await post(twoPi, routes.withdrawsPath, data)

  return await processTransactionResponse(twoPi, response)
}
