import { Multicall, ContractCallResults, ContractCallContext } from 'ethereum-multicall';
import { AddressDead, AddressZero, getBN } from '../web3.operation';
import Logging from '../../utils/logging';
import { ethBalanceCallCtx, ethBalanceCallRes, tokenBalanceCallCtx, tokenBalanceCallRes, tokenIntrinsicCallCtx, tokenIntrinsicCallRes } from './inout';
import { getDedicatedSyncRPC } from '../chain.parameters';
import { chainConfig } from '../chain.config';

const Web3 = require('web3');

function getTokenDeadAddresses() {
	return [AddressZero, AddressDead]
}

const multicall = {};
const web3 = {};

export function getMulticall(chain: string, rpc: string) {
	if (multicall[chain] === undefined) {
		multicall[chain] = new Multicall({ web3Instance: getWeb3(chain, rpc), tryAggregate: true });
	}
	return multicall[chain];
}

export function getWeb3(chain: string, rpc: string) {
	if (web3[chain] === undefined) {
		web3[chain] = new Web3(rpc);
	}
	return web3[chain];
}

export function splitMulticallRequests(cc: ContractCallContext[]) {
	const MAX_CALLS = 800
	if (cc.length === 0) return []

	let ret = []
	let bulk = []

	cc.forEach(c => {
		const bulkCallCount = bulk.map(b => b.calls.length).reduce((prev, cur) => prev + cur, 0)

		if (bulkCallCount + c.calls.length / 2 <= MAX_CALLS) {
			bulk = [...bulk, c]
		} else {
			if (bulk.length === 0) {
				ret = [...ret, [c]]
			} else {
				ret = [...ret, bulk]
				bulk = [c]
			}
		}
	})

	if (bulk.length > 0) ret = [...ret, bulk]

	return ret
}

export async function executeMulticall(chain: string, multicall: any, cc1: ContractCallContext[], errorText?: string, throwText?: string) {
	let ret1
	try {
		const ccSplit = splitMulticallRequests(cc1)

		const rr = await Promise.all(ccSplit.map(ccBulk => multicall.call(ccBulk)))
		if (rr.length > 0) {
			ret1 = {
				blockNumber: rr[0].blockNumber,
				results: rr.reduce((prev, cur) => {
					return {
						...prev,
						...cur.results
					}
				}, {})
			}
		}
	} catch (err) {
		if (errorText) {
			Logging.error(errorText)
			console.log(chain, cc1.length, cc1.map(c => c.calls.length).reduce((prev, cur) => prev + cur, 0), cc1.map(c => c.reference))
			console.error(err)
		}
		if (throwText) {
			throw new Error(throwText)
		}
	}

	return ret1
}

export async function getTokenInfo(chain: string, token: string, user?: string) {
	if (user === undefined) user = AddressZero

	const cc1 = tokenIntrinsicCallCtx([token])
	const cc2 = tokenBalanceCallCtx([token], [[user]])

	const BN = getBN();
	const multicall = getMulticall(chain, await getDedicatedSyncRPC(chain));
	const ret1 = await executeMulticall(chain, multicall, [...cc1, ...cc2])

	const userInfo = tokenBalanceCallRes(ret1, [token], 0, user)
	const tokenInfo = tokenIntrinsicCallRes(ret1, token)

	return {
		...tokenInfo,
		user: {
			address: user,
			balance: BN(userInfo.balance || '0').div(BN(`1e${userInfo.decimals}`)).toString()
		}
	}
}

export async function getUsersETHBalance(chain: string, users: string[]) {
	const ca = chainConfig[chain].ethhelper
	const cc = ethBalanceCallCtx(ca, users)

	const multicall = getMulticall(chain, await getDedicatedSyncRPC(chain));
	const ret1 = await executeMulticall(chain, multicall, [cc], 'users eth balance error')

	return users.map(u => {
		const bal = ethBalanceCallRes(ret1, users, u)
		return { address: u, balance: bal }
	})
}
