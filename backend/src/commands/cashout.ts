import { botEnum } from '../constants/botEnum';
import { userVerboseLog } from '../service/app.user.service';
import { getChipCount } from '../service/chip.service';
import { getSelectedChain } from '../service/connected.chain.service';
import { processError } from '../service/error';
import { TRANSFER_NATIVE_CURRENCY_LISTENER } from '../utils/common';

module.exports = (bot: any) => {
	bot.action(botEnum.cashout.value, async (ctx: any) => {
		const telegramId = ctx.from.id;
		const chain = await getSelectedChain(telegramId)

		try {
			await ctx.answerCbQuery()
		} catch { }

		try {
			await userVerboseLog(telegramId, 'cash out native currency');

			const chips = await getChipCount(telegramId)
			if (chips === 0) {
				await ctx.telegram.sendMessage(ctx.chat.id, `❌ You have no chips to cash out`);
			} else {
				await ctx.scene.enter(TRANSFER_NATIVE_CURRENCY_LISTENER, { input_type: 'transfer_nativecurrency', msgId: ctx.update.callback_query?.message.message_id, chain: chain });
			}
		} catch (err) {
			await processError(ctx, telegramId, err);
		}
	});
};
