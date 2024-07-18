import { RoundModel } from "../models/round.model";
import { getAppUser } from "./app.user.service";
import { addChips, getChipCount } from "./chip.service";
import { analyzeRound, putWager } from "./round.stat.service";

const findRealValue = (value: string) => {
	if (Number(value)) {
		return Number(value);
	}
	if (value === "J" || value === "Q" || value === "K") {
		return 10;
	}
	if (value === "A") {
		return 1;
	}
};

const suits = ["H", "C", "D", "S"]
const value = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

export const convertNumberToCard = (c: number) => {
	const suit = suits[Math.floor(c / 13)]
	const v = (c % 13) + 1
	const value = v === 1 ? 'A' : v === 11 ? "J" : v === 12 ? "Q" : v === 13 ? 'K' : v.toString()
	const rv = findRealValue(value)

	return {
		suit,
		value,
		rv
	}
}

export const calculateTotalHandValue = (hand: any[]) => {
	const minsum = hand.reduce((prev, cur) => {
		let ret = prev + cur.rv
		return ret
	}, 0)

	return hand.reduce((prev, cur) => {
		const check = (cur.value === 'A')
		if (check && prev < 12) {
			prev += 10
		}
		return prev
	}, minsum)
}

var seed = (new Date()).getTime()
function random() {
	var x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

function shuffleDeck() {
	let deck = Array.from(Array(52).keys())

	let shuffleCount = ((Math.floor(random() * 1000) % 150)) + 100
	while (shuffleCount > 0) {
		shuffleCount--
		const mid = Math.floor(random() * 1000) % 52
		const tmp = deck[mid]
		deck[mid] = deck[51]
		deck[51] = tmp
	}

	if (Math.floor(random() * 1000) < 60) { // 10% probability
		while (convertNumberToCard(deck[1]).rv !== 1 && convertNumberToCard(deck[1]).rv !== 10) {
			let i
			for (i = 4; i < 52; i ++) {
				if (convertNumberToCard(deck[i]).rv === 1 || convertNumberToCard(deck[i]).rv === 10) {
					const tmp = deck[i]
					deck[i] = deck[1]
					deck[1] = tmp

					break
				}
			}

			if (i === 52) break
		}

		while (convertNumberToCard(deck[1]).rv + convertNumberToCard(deck[3]).rv !== 11) {
			let i
			for (i = 4; i < 52; i ++) {
				if (convertNumberToCard(deck[1]).rv + convertNumberToCard(deck[i]).rv === 11) {
					const tmp = deck[i]
					deck[i] = deck[3]
					deck[3] = tmp
					break
				}
			}
			if (i === 52) break
		}
		console.log("Dealer House Edge!!!")
	}
	console.log('*** Shuffled ***')

	// return [11, 21, 12, 38, 34, 8, 51, 23, 25, 16, 31, 35, 29]
	return deck
}

export async function createNewRound(telegramId: string, chips: number) {
	const chipCount = await getChipCount(telegramId)
	if (chips > chipCount) {
		throw new Error("Can't bet over chips you have")
	}

	const user = await getAppUser(telegramId)

	await addChips(user._id, 0 - chips)
	const deck = shuffleDeck()
	const newRound = new RoundModel({
		user: user._id,
		deck: deck.slice(4),
		dealer: [deck[1], deck[3]],
		player: [deck[0], deck[2]],
		state: 'playing',
		chips: chips,
		hand: 'player',
		result: "none",
	})

	newRound.playerHand = calculateTotalHandValue(newRound.player.map((c: number) => convertNumberToCard(c)))
	newRound.dealerHand = calculateTotalHandValue(newRound.dealer.slice(1).map((c: number) => convertNumberToCard(c)))

	if (newRound.playerHand === 21) {
		newRound.hand = 'dealer'
		newRound.dealerHand = calculateTotalHandValue(newRound.dealer.map((c: number) => convertNumberToCard(c)))
	}

	await newRound.save()

	await putWager(telegramId, chips)
}

export async function getPlayingRound(telegramId: string) {
	const user = await getAppUser(telegramId)
	const roundData = await RoundModel.findOne({ user: user._id, state: 'playing' })
	if (roundData === null) return roundData

	if (roundData.hand === 'player') {
		roundData.dealer = roundData.dealer.slice(1)
	}
	return roundData
}

function doDealerProc(roundData: any) {
	roundData.hand = 'dealer'

	let dealer = roundData.dealer
	let deck = roundData.deck

	while (true) {
		const dealerCtx = dealer.map((c: number) => convertNumberToCard(c))
		const dealerHand = calculateTotalHandValue(dealerCtx)
		if (dealerHand === 17) {
			if (dealerCtx.length === 2 && (dealerCtx[0].value === 'A' || dealerCtx[1].value === 'A')) {
				// hit again
			} else break
		} else if (dealerHand > 17) {
			break
		}
		// hit procedure
		dealer = [...dealer, deck[0]]
		deck = deck.slice(1)
	}

	roundData.dealer = dealer
	roundData.deck = deck
	roundData.dealerHand = calculateTotalHandValue(dealer.map((c: number) => convertNumberToCard(c)))
}

export async function standRound(telegramId: string) {
	const user = await getAppUser(telegramId)
	const roundData = await RoundModel.findOne({ user: user._id, state: 'playing' })
	if (roundData === null) return

	if (roundData.hand !== 'player') {
		throw new Error("❌ Not player turn")
	}

	doDealerProc(roundData)

	await roundData.save()
}

export async function hitRound(telegramId: string) {
	const user = await getAppUser(telegramId)
	const roundData = await RoundModel.findOne({ user: user._id, state: 'playing' })
	if (roundData === null) return

	if (roundData.hand !== 'player') {
		throw new Error("❌ Not player turn")
	}

	roundData.player.push(roundData.deck[0])
	roundData.deck = roundData.deck.slice(1)
	roundData.playerHand = calculateTotalHandValue(roundData.player.map((c: number) => convertNumberToCard(c)))

	if (roundData.playerHand > 20) {
		doDealerProc(roundData)
	}

	await roundData.save()
}

export async function doubleDownRound(telegramId: string) {
	const user = await getAppUser(telegramId)
	const roundData = await RoundModel.findOne({ user: user._id, state: 'playing' })
	if (roundData === null) return

	if (roundData.hand !== 'player') {
		throw new Error("❌ Not player turn")
	}

	const chipCount = await getChipCount(telegramId)
	if (chipCount < roundData.chips) {
		throw new Error("❌ Not enough chips")
	}

	if (roundData.player.length !== 2) {
		throw new Error("❌ Can't double down with more than 2 cards")
	}

	const deductCount = roundData.chips
	roundData.chips = roundData.chips * 2
	
	doDealerProc(roundData)

	await roundData.save()
	await addChips(user._id, 0 - deductCount)
	await putWager(telegramId, deductCount)
}

export async function endRound(telegramId: string) {
	const user = await getAppUser(telegramId)
	const roundData: any = await RoundModel.findOne({ user: user._id, state: 'playing' })
	if (roundData === null) return

	roundData.state = 'ended'
	const { playerHand, dealerHand } = roundData._doc;

	if (
		(playerHand <= 21 && playerHand > dealerHand) ||
		(dealerHand > 21 && playerHand <= 22)
	) {
		roundData.result = "player";
	}

	if (
		(dealerHand <= 21 && dealerHand > playerHand) ||
		(playerHand > 21 && dealerHand <= 22)
	) {
		roundData.result = "dealer";
	}

	if (dealerHand === playerHand) roundData.result = "push";

	if (dealerHand > 21 && playerHand > 21) roundData.result = "bust";

	if (roundData.result === 'push') {
		await addChips(user._id, roundData.chips)
	} else if (roundData.result === 'player') {
		if (playerHand === 21 && roundData.player.length === 2) await addChips(user._id, roundData.chips + Math.floor(roundData.chips * 3 / 2))
		else await addChips(user._id, roundData.chips * 2)
	}

	await analyzeRound(telegramId, roundData._doc)

	await roundData.save()
}

export async function testShuffle() {
	for (let i = 0; i < 1000; i ++) {
		const deck = shuffleDeck()
		const v = calculateTotalHandValue([deck[1], deck[3]].map((c: number) => convertNumberToCard(c)))
		if (v === 21) console.log('                            *** Blackjack ***')
		console.log(i, v)
	}
}
