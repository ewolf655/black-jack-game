import { chainConfig } from './chain.config';

let botInstance: any;

export function getBotInstance() {
	return botInstance;
}

export function setBotInstance(bot: any) {
	botInstance = bot
}

export async function getRouter(chain: string) {
	return chainConfig[chain].router
}

export async function getChainTokens(chain: string) {
	return chainConfig[chain].tokens?.map(t => t.toLowerCase()) || []
}

export async function getFactory(chain: string) {
	return chainConfig[chain].factory || '';
}

export async function getRPC(telegramId: string, chain: string) {
	// const info = await ChainModel.findOne({ name: chain });
	// if (chain === 'ethereum') {
	//     let antiMEV = false
	//     try {
	//         const user = await getAppUser(telegramId)
	//         const setting = await SettingsModel.findOne({ user: user._id, chain: info._id })
	//         antiMEV = setting?.antiMEV
	//     } catch (err) {
	//     }
	//     return (antiMEV === true) ? info?.rpcUrls[1] : info?.rpcUrls[2]
	// } else {
	//     return info?.rpcUrls[1] || '';
	// }
	return chainConfig[chain].rpcUrls[0]
}

export async function getDedicatedSyncRPC(chain: string) {
	return chainConfig[chain].rpcUrls[0]
}

export async function getBlockExplorerApiKey(chain: string) {
	return chainConfig[chain].blockExplorerApiKey || '';
}

export async function getBlockExplorerApiEndpoint(chain: string) {
	return chainConfig[chain].blockExplorerApiEndpoint || '';
}

export async function getBlockExplorer(chain: string) {
	return chainConfig[chain].blockExplorer || '';
}

export async function getNativeCurrencyDecimal(chain: string) {
	return chainConfig[chain].nativeCurrency.decimals || 18;
}

export async function getNativeCurrencySymbol(chain: string) {
	return chainConfig[chain].nativeCurrency.label || '###';
}
