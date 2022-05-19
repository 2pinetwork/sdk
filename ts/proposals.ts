import routes from './helpers/routes.json'
import { get, $delete } from './helpers/request'
import TwoPi from './twoPi'

type Data = {
  data: string
  to:   string
}

type Details = {
  to:        string
  function:  string
  arguments: Array<string>
}

type Provider = {
  chainId:  number
  gasPrice: number
  rpcUrl:   string
}

type Transaction = {
  description: string
  data:        Data
  details:     Details
  provider:    Provider
}

type Constructor = {
  id:          number
  status:      string
  transaction: Transaction
  createdAt:   Date
}

export type Filter = {
  status: string | undefined
} | undefined

export class Proposal {
  readonly id:          number
  readonly status:      string
  readonly transaction: Transaction
  readonly createdAt:   Date

  constructor({ id, status, transaction, createdAt }: Constructor) {
    this.id          = id
    this.status      = status
    this.transaction = transaction
    this.createdAt   = createdAt
  }
}

type DataData = {
  data: string
  to:   string
}

type DetailsData = {
  to:        string
  function:  string
  arguments: Array<string>
}

type ProviderData = {
  chain_id:  number
  gas_price: number
  rpc_url:   string
}

type TransactionData = {
  description: string
  data:        DataData
  details:     DetailsData
  provider:    ProviderData
}

type ProposalData = {
  id:          number
  status:      string
  transaction: TransactionData
  created_at:  string
}

const params = (filter: Filter): Record<string, string> => {
  const params: Record<string, string> = {}

  if (filter?.status) {
    params.status = filter.status
  }

  return params
}

export const getProposals = async (twoPi: TwoPi, filter: Filter): Promise<Array<Proposal>> => {
  const response = await get(twoPi, routes.proposalsPath, params(filter))

  return response.data.data.map((proposal: ProposalData): Proposal => {
    const { id, status, created_at: createdAt } = proposal
    const { description, data, details }        = proposal.transaction

    const {
      chain_id:  chainId,
      gas_price: gasPrice,
      rpc_url:   rpcUrl
    } = proposal.transaction.provider || {}

    const transaction = {
      description,
      data,
      details,
      provider: { chainId, gasPrice, rpcUrl }
    }

    return new Proposal({
      id,
      status,
      transaction,
      createdAt: new Date(createdAt)
    })
  })
}

export const deleteProposal = async (
  twoPi:    TwoPi,
  proposal: Proposal
): Promise<boolean> => {
  const path     = `${routes.proposalsPath}/${proposal.id}`
  const response = await $delete(twoPi, path, {})

  return response.status === 204
}
