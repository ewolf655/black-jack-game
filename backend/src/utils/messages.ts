import * as dotenv from 'dotenv';
import path from 'path';
import { getWallet } from '../service/wallet.service';

import { getNativeCurrencySymbol } from '../web3/chain.parameters';
import {
	NOT_STARTED,
	NOT_ENOUGH_BALANCE,
	TOO_MUCH_REQUESTED,
	NOT_CONFIGURED_CHAIN,
	NOT_CONNECTED_CHAIN,
	NOT_CONNECTED_WALLET,
	NOT_APPROVED,
	INSUFFICIENT_ETH,
	ALREADY_EXIST,
	GASPRICE_OVERLOADED,
	GAS_EXCEEDED,
	TX_ERROR,
	ESTIMATE_GAS_ERROR,
	INVALID_VALUE_SET,
	INVALID_WALLET_ADDRESS,
	INVALID_OPERATION
} from './common';
import { getETHBalance, userETHBalance } from '../web3/nativecurrency/nativecurrency.query';
import { FREE_MODE, getChipCount, getChipInfo } from '../service/chip.service';
import { getBN } from '../web3/web3.operation';
import { getSecurityKey } from '../service/security.service';

dotenv.config();
if (process.env.NODE_ENV == ('development' || 'development ')) {
	dotenv.config({ path: path.join(__dirname, '..', '.env.development') });
} else if (process.env.NODE_ENV == ('production' || 'production ')) {
	dotenv.config({ path: path.join(__dirname, '..', '.env') });
} else if (process.env.NODE_ENV == ('staging' || 'staging ')) {
	dotenv.config({ path: path.join(__dirname, '..', '.env.staging') });
}

// Swift, @SwiftPortalOfficial
export async function startMessage(telegramId: string, chain: string) {
	const BN = getBN()
	const w = await getWallet(telegramId)
	const ethBal = await getETHBalance(telegramId, chain, w.address)
	const nativeSymbol = await getNativeCurrencySymbol(chain)
	const chipInfo = await getChipInfo()

	let chipCount = 0
	try {
		chipCount = await getChipCount(telegramId)
	} catch (err) { }

	let text = ''

	text += `🃏 Welcome to <b>Blackjack</b>!\n`
	text += '\n'
	text += `🛢 Chips: <code>${chipCount}</code>\n`
	if (FREE_MODE === true) {
		text += '😉 <b>Free mode</b>\n'
	} else {
		text += '\n'
		text += `Your deposit address (<code>${parseFloat(BN(ethBal).toFixed(4))}</code> <b>${nativeSymbol}</b>)\n`
		text += `<code>${w.address}</code>\n`

		text += '\n'
		text += `🛢 1 Chip = <code>${chipInfo.price}</code> <b>${chipInfo.unit}</b>\n`
	}

	return text
}

export async function getTransferMessage(telegramId: string, chain: string, walletId?: string) {
	let ret = `🔗 <b>Current chain:</b> ${chain}\n`;


	let wallet;
	try {
		wallet = await getWallet(telegramId)
	} catch { }
	const connected = wallet !== undefined;

	if (connected === true) {
		ret += `✅ Wallet: Connected\n`;
		ret += `Address: <code>${wallet.address}</code>\n\n`;

		const ethBal = await getETHBalance(telegramId, chain, wallet.address);
		ret += `💰 Available balance: <b>${ethBal} ${await getNativeCurrencySymbol(chain)}</b>`;
	} else {
		ret += 'Wallet: <b>disconnected</b>\n';
	}

	return ret;
}

export async function getChainStatus(telegramId: string, chain: string) {
	let ret = `✅ Chain: <b>${chain}</b>\n\n`;

	let wallet;
	try {
		wallet = await getWallet(telegramId);
	} catch { }
	const connected = wallet !== undefined;

	if (connected === true) {
		ret += `Wallet: <b>connected</b>\n`;
		ret += `Address: <code>${wallet.address}</code>\n\n`;

		const ethBal = await userETHBalance(telegramId, chain);
		ret += `You have <b>${ethBal} ${await getNativeCurrencySymbol(chain)}</b>`;
	} else {
		ret += 'Wallet: <b>disconnected</b>\n';
	}

	return ret;
}

export async function getErrorMessageResponse(telegramId: string, error: string) {
	if (error === NOT_STARTED) {
		return `⚠️ You never started here\nPlease run by /start`;
	} else if (error.startsWith(NOT_ENOUGH_BALANCE) || error.startsWith(TOO_MUCH_REQUESTED)) {
		return error;
	} else if (error === NOT_CONFIGURED_CHAIN) {
		return `⚠️ Not configured chain\nPlease run by /start`;
	} else if (error === NOT_CONNECTED_CHAIN) {
		return `⚠️ Not connected chain\nPlease run by /start`;
	} else if (error === NOT_CONNECTED_WALLET) {
		return `⚠️ Not connected wallet\nPlease run by /wallets`;
	} else if (error === NOT_APPROVED) {
		return `⚠️ Token not approved\nPlease approve it by clicking <b>Approve</b> button`;
	} else if (error.startsWith(INSUFFICIENT_ETH) || error.startsWith(GASPRICE_OVERLOADED) || error.startsWith(GAS_EXCEEDED) || error.startsWith(TX_ERROR) || error.startsWith(ESTIMATE_GAS_ERROR) || error.startsWith(INVALID_VALUE_SET) || error.startsWith(INVALID_WALLET_ADDRESS) || error.startsWith(INVALID_OPERATION)) {
		return error;
	} else if (error.startsWith(ALREADY_EXIST)) {
		return error;
	}
	return null;
}

export function disabledEnabledEmoji(value: any) {
	if (value) {
		return '✅';
	} else {
		return '❌';
	}
}


export async function changeMainWalletMessage(currentAddress: any, totalAddresses: number) {
	let response = `💳 <b>Current Wallet:</b> ${currentAddress.name || 'Main'}\n`;
	response += `🔗 Address: <code>${currentAddress.address}</code>\n`;
	response += `✅ Available Wallets: ${totalAddresses}`;

	return response;
}
