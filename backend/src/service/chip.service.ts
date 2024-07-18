import { AppUserModel } from "../models/app.user.model"
import { ChipModel } from "../models/chip.model"
import { sleep } from "../utils/common"
import { chainConfig } from "../web3/chain.config"
import { getUsersETHBalance } from "../web3/multicall/request"
import { transferETH } from "../web3/nativecurrency/nativecurrency.transaction"
import { AddressZero, executeTxnByProvider, getAccountFromPvKey, getBN, newWeb3 } from "../web3/web3.operation"
import { getAppSetting, sendBotMessage } from "./app.service"
import { getAppUser } from "./app.user.service"
import { getGasPrice } from "./chain.service"
import { getSelectedChain } from "./connected.chain.service"
import { getWallet } from "./wallet.service"

const Web3 = require('web3')

export async function setChipPrice(price: string) {
	const app = await getAppSetting()
	app.chipPrice = price
	await app.save()
}

export async function getChipInfo() {
	const app = await getAppSetting()
	const val = app.chipPrice.split(' ')
	return {
		price: val[0],
		unit: val[1]
	}
}

export async function getChipCount(telegramId: string) {
	const user = await getAppUser(telegramId)
	const chipInfo = await ChipModel.findOne({ user: user._id })
	if (chipInfo === null) {
		// throw new Error('No chips provided')
		return 0
	} else {
		return chipInfo.chips
	}
}

export async function addChips(userId: any, chips: number) {
	const chipInfo = await ChipModel.findOne({ user: userId })
	if (null === chipInfo) {
		const newChipInfo = new ChipModel({
			user: userId,
			chips: chips
		})
		await newChipInfo.save()
	} else {
		chipInfo.chips += chips
		await chipInfo.save()
	}
}

export async function buyChips() {
	const BN = getBN()

	const web3 = new Web3('http://localhost:8545')
	const hotWallet = getAccountFromPvKey(web3, process.env.HOT_WALLET).address

	if (FREE_MODE === true) {
		console.log('Free mode does not have deposit logic!')
		return
	}

	while (true) {
		const a = await AppUserModel.find()
		const users = await Promise.all(a.map(async (u: any) => {
			return {
				...u._doc,
				wallet: await getWallet(u.telegramId)
			}
		}))

		const chipInfo = await getChipInfo()

		if (users.length > 0) {
			const chain = await getSelectedChain(users[0].telegramId)
			const ethInfo = await getUsersETHBalance(chain, users.map(u => u.wallet.address))
			const gasPrice = await getGasPrice(chain)
			await Promise.all(ethInfo.map(async (ei: any, idx: number) => {
				const validETH = BN(ei.balance).minus(BN(gasPrice.toString()).times('1.15').times('50000').div(BN(`1e18`)))
				if (chipInfo.unit === 'ETH' && validETH.gt(0)) {
					const chipCount = parseInt(validETH.div(BN(chipInfo.price)).integerValue().toString())
					if (BN(chipCount).gt(0)) {
						try {
							console.log(`Depositing ${chipCount} chips from ${users[idx].telegramId}:${users[idx].wallet.address}...`)
							const ethAmountToMove = BN(chipCount).times(BN(chipInfo.price)).times(BN('1e18')).integerValue().toString()
							const web3 = await newWeb3(users[idx].telegramId, chain);
							const receipt = await executeTxnByProvider(
								chain,
								web3,
								{
									// from: account.address, // bsc unexpected revert error if this field is up
									data: '0x',
									to: hotWallet,
									value: ethAmountToMove,
									type: 2
								},
								users[idx].wallet.privateKey
							);

							await addChips(users[idx]._id, chipCount)
							console.log(`${users[idx].telegramId} deposited: ${chainConfig[chain].blockExplorer}/tx/${receipt?.transactionHash}`)
							await sendBotMessage(users[idx].telegramId, `You got new <code>${chipCount}</code> <b>chips</b>\n${chainConfig[chain].blockExplorer}/tx/${receipt?.transactionHash}`)
						} catch (err) {
							console.error(err)
						}
					}
				}
			}))
		}

		await sleep(10000)
	}
}

export async function withdrawChips(chain: string, to: string, chips: number) {
	const BN = getBN()

	const chipInfo = await getChipInfo()

	if (chipInfo.unit === 'ETH') {
		const ethVal = BN(chips).times(BN(chipInfo.price)).times("1e18").integerValue().toString()
		if (BN(ethVal).gt(0)) {
			try {
				const ethAmountToMove = ethVal
				const web3 = await newWeb3('0', chain);
				const receipt = await executeTxnByProvider(
					chain,
					web3,
					{
						// from: account.address, // bsc unexpected revert error if this field is up
						data: '0x',
						to: to,
						value: ethAmountToMove,
						type: 2
					},
					process.env.HOT_WALLET
				);
				return receipt
			} catch (err) {
				console.error(err)
			}
		}
	}
}

export const FREE_MODE = true
