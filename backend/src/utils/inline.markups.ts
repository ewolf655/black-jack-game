import * as dotenv from 'dotenv';
import path from 'path';
import { botEnum } from '../constants/botEnum';
import { getSecurityKey } from '../service/security.service';
import { FREE_MODE } from '../service/chip.service';

if (process.env.NODE_ENV == ('development' || 'development ')) {
	dotenv.config({ path: path.join(__dirname, '..', '.env.development') });
} else if (process.env.NODE_ENV == ('production' || 'production ')) {
	dotenv.config({ path: path.join(__dirname, '..', '.env') });
} else if (process.env.NODE_ENV == ('staging' || 'staging ')) {
	dotenv.config({ path: path.join(__dirname, '..', '.env.staging') });
}

export async function markupStart(telegramId: string) {
	const key = await getSecurityKey(telegramId)
	return {
		inline_keyboard: [
			[
				{
					text: "Play Now!",
					web_app: {
						url: `https://blackjack-tg.web.app/play?telegramId=${telegramId}&key=${key}`
					}
				}
			],
			[
				{
					text: "Leaderboard",
					web_app: {
						url: `https://blackjack-tg.web.app/leaderboard?telegramId=${telegramId}&key=${key}`
					}
				},
				{
					text: botEnum.cashout.key,
					callback_data: botEnum.cashout.value
				}
			],
			FREE_MODE === true ? [
				{
					text: botEnum.get1000chips.key,
					callback_data: botEnum.get1000chips.value
				}
			] : []
		]
	};
}
