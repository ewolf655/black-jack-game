import { ContractCallResults, ContractCallContext } from 'ethereum-multicall'
import ERC20 from '../abi/ERC20.json'
import PriceFeed from '../abi/IPriceFeed.json'
import { AddressDead, AddressZero, getBN } from '../web3.operation'

function getTokenDeadAddresses() {
    return [AddressZero, AddressDead]
}

export function tokenBalanceCallCtx(tokens: string[], users: string[][], ex?: string) {
    const cc2: ContractCallContext[] = tokens.map((address, idx) => {
        return {
            reference: `token-balance-${address}${idx}${ex ? `-${ex}` : ''}`,
            contractAddress: address,
            abi: ERC20.abi,
            calls: [
                {
                    reference: `decimals`,
                    methodName: 'decimals',
                    methodParameters: []
                },
                ...users[idx].map(u => {
                    return {
                        reference: `userBalance-${u}`,
                        methodName: 'balanceOf',
                        methodParameters: [u]
                    }
                })
            ]
        }
    })

    return cc2
}

export function tokenBalanceCallRes(ret: ContractCallResults, tokens: string[], idx: number, user: string, ex?: string) {
    const BN = getBN()

    const address = tokens[idx]
    const ctx = ret.results[`token-balance-${address}${idx}${ex ? `-${ex}` : ''}`].callsReturnContext
    return {
        balance: BN(ctx?.find((c) => c.decoded === true && c.reference === `userBalance-${user}`)?.returnValues[0].hex || '0'),
        decimals: ctx?.find((c) => c.decoded === true && c.reference === `decimals`)?.returnValues[0]
    }
}

export function tokenIntrinsicCallCtx(tokens: string[], ex?: string) {
    const cc2: ContractCallContext[] = tokens.map(address => {
        return {
            reference: `token-intrinsic-${address}${ex ? `-${ex}` : ''}`,
            contractAddress: address,
            abi: ERC20.abi,
            calls: [
                {
                    reference: 'name',
                    methodName: 'name',
                    methodParameters: []
                },
                {
                    reference: 'owner',
                    methodName: 'owner',
                    methodParameters: []
                },
                {
                    reference: 'symbol',
                    methodName: 'symbol',
                    methodParameters: []
                },
                {
                    reference: 'decimals',
                    methodName: 'decimals',
                    methodParameters: []
                },
                {
                    reference: 'totalSupply',
                    methodName: 'totalSupply',
                    methodParameters: []
                },
                ...getTokenDeadAddresses().map(a => {
                    return {
                        reference: `balance-${a}`,
                        methodName: 'balanceOf',
                        methodParameters: [a]
                    }
                })
            ]
        }
    })

    return cc2
}

export function tokenIntrinsicCallRes(ret: ContractCallResults, token: string, ex?: string) {
    const BN = getBN()
    const ctx = ret.results[`token-intrinsic-${token}${ex ? `-${ex}` : ''}`].callsReturnContext
    const decimals = ctx.find(t => t.decoded === true && t.reference === 'decimals')?.returnValues[0] || 18

    const bal = getTokenDeadAddresses().map(a => ctx.find(t => t.decoded === true && t.reference === `balance-${a}`)?.returnValues[0]?.hex)
    const valid = bal.filter(b => b === undefined).length === 0
    const burnt = valid === true ? bal.reduce((prev, cur) => prev.plus(BN(cur)), BN(0)).div(BN(`1e${decimals}`)).toString() : undefined

    return {
        address: token.toLowerCase(),
        name: ctx.find(t => t.decoded === true && t.reference === 'name')?.returnValues[0] || '',
        symbol: ctx.find(t => t.decoded === true && t.reference === 'symbol')?.returnValues[0] || '',
        decimals: decimals,
        owner: ctx.find(t => t.decoded === true && t.reference === 'owner')?.returnValues[0]?.toLowerCase() || '',
        totalSupply: BN(ctx.find(t => t.decoded === true && t.reference === 'totalSupply')?.returnValues[0]?.hex || '0').div(BN(`1e${decimals}`)).toString(),
        valid,
        burnt
    }
}

export function pricefeedCallCtx(priceFeeds: string[], ex?: string) {
    const cc2: ContractCallContext[] = priceFeeds.map(addr => {
        return {
            reference: `pricefeed-${addr}${ex ? `-${ex}` : ''}`,
            contractAddress: addr,
            abi: PriceFeed.abi,
            calls: [
                {
                    reference: 'latestAnswer',
                    methodName: 'latestAnswer',
                    methodParameters: []
                }
            ]
        }
    })

    return cc2
}

export function pricefeedCallRes(ret: ContractCallResults, priceFeed: string, ex?: string) {
    const BN = getBN()
    const ctx = ret.results[`pricefeed-${priceFeed}${ex ? `-${ex}` : ''}`].callsReturnContext
    return BN(ctx?.find(t => t.decoded === true && t.reference === `latestAnswer`)?.returnValues[0]?.hex || '0').div(BN(`1e8`)).toString()
}

export function ethBalanceCallCtx(ca: string, users: string[], ex?: string) {
    const cc2: ContractCallContext = {
		reference: `ethbalance${ex ? `-${ex}` : ''}`,
		contractAddress: ca,
		abi: [
			{
				"inputs": [
					{
						"internalType": "address[]",
						"name": "users",
						"type": "address[]"
					}
				],
				"name": "getBalances",
				"outputs": [
					{
						"internalType": "uint256[]",
						"name": "",
						"type": "uint256[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		],
		calls: [
			{
				reference: 'getBalances',
				methodName: 'getBalances',
				methodParameters: [users]
			}
		]
	}

    return cc2
}

export function ethBalanceCallRes(ret: ContractCallResults, users: string[], user: string, ex?: string) {
    const BN = getBN()
    const ctx = ret.results[`ethbalance${ex ? `-${ex}` : ''}`].callsReturnContext
	const balances = ctx?.find(t => t.decoded === true && t.reference === `getBalances`)?.returnValues
	if (balances === undefined) {
		throw new Error('Failed to request eth balances')
	}
	const idx = users.indexOf(user)
	if (idx < 0) {
		throw new Error('Invalid user')
	}

    return BN(balances[idx].hex).div(BN(`1e18`)).toString()
}
