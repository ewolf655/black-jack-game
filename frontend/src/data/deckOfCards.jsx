const findRealValue = (value) => {
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

export const convertNumberToCard = (c) => {
	const suit = suits[Math.floor(c / 13)]
	const v = (c % 13) + 1
	const value = v === 1? 'A': v === 11? "J": v === 12? "Q": v === 13? 'K': v.toString()
	const rv = findRealValue(value)

	return {
		suit,
		value,
		rv
	}
}
