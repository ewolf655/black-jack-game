import { getBN, newWeb3 } from '../web3/web3.operation';
import { chainConfig } from '../web3/chain.config';

export async function chainGasPrice(chain: string) {
	const BN = getBN();
	const p = await getGasPrice(chain);
	return BN(p.toString()).div(BN('1e9')).toString();
}

export async function getGasPrice(chain: string, details?: boolean) {
	const BN = getBN()
	const web3 = await newWeb3('', chain)
	const ret = await Promise.all([
		web3.eth.getBlock('pending'),
		web3.eth.getBlock('latest')
	])
	if (details === true) {
		return {
			pending: ret[0].baseFeePerGas,
			latest: ret[1].baseFeePerGas
		}
	} else {
		return ret[0].baseFeePerGas
	}
}

export function getAllChains() {
	let ret = ['ethereum'];
	for (const ch in chainConfig) {
		if (ret.indexOf(ch) < 0) {
			ret = [...ret, ch];
		}
	}

	return ret;
}
