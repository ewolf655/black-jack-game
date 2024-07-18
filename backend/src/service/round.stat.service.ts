import { RoundStatModel } from "../models/round.stat.model";
import { getAppUser } from "./app.user.service";
import { getChipCount } from "./chip.service";

export async function getRoundStat(telegramId: string) {
	const user = await getAppUser(telegramId)
	if (0 === await RoundStatModel.countDocuments({user: user._id})) {
		const newItem = new RoundStatModel({
			user: user._id,
			chips: await getChipCount(telegramId),
			profit: 0,
			lose: 0,
			highScore: 0,
			playedTimes: 0,
			winTimes: 0,
			loseTimes: 0,
			wager: 0
		})

		await newItem.save()
	}

	return await RoundStatModel.findOne({user: user._id})
}

export async function putWager(telegramId: string, wager: number) {
	const stat = await getRoundStat(telegramId)
	if (wager <= 0) {
		throw new Error('Unable to put negative wager')
	}

	stat.wager += wager
	await stat.save()
}

export async function analyzeRound(telegramId: string, round: any) {
	const stat = await getRoundStat(telegramId)

	stat.chips = await getChipCount(telegramId)
	if (round.result === 'player') {
		stat.profit += (round.playerHand === 21 && round.player.length === 2)? Math.floor(round.chips * 3 / 2): round.chips
		stat.winTimes ++
	} else if (round.result === 'dealer') {
		stat.lose += round.chips
		stat.loseTimes ++
	}

	if (stat.highScore < stat.profit - stat.lose) stat.highScore = stat.profit - stat.lose
	stat.playedTimes ++

	await stat.save()
}

export async function getLeaderboard() {
	const all = await RoundStatModel.find()
	const users = await Promise.all(all.map(u => u.populate('user')))

	return users.map((u: any) => u._doc).sort((a, b) => a.highScore > b.highScore? -1: a.highScore < b.highScore? 1: 0).map((u, idx) => {
		return {
			...u,
			rank: idx + 1
		}
	})
}
