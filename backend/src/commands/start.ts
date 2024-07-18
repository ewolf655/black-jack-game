import { botEnum } from '../constants/botEnum';
import { startMessage } from '../utils/messages';
import { markupStart } from '../utils/inline.markups';
import { createAppUserIfNotExist, getAppUser, updateChatId, userVerboseLog } from '../service/app.user.service';
import { processError } from '../service/error';
import { getSelectedChain, selectChain } from '../service/connected.chain.service';
import { getAllChains } from '../service/chain.service';
import { createRandomWallet, getWallet } from '../service/wallet.service';
import { addChips } from '../service/chip.service';
import { generateNewSecurityKey } from '../service/security.service';

const invokeStart = async (ctx: any) => {
	const telegramId = ctx.from.id;
	// check if user exist, save if not found
	try {
		await userVerboseLog(telegramId, '/start' + ' ' + JSON.stringify(ctx.from));

		const accountExistsOrCreated = await createAppUserIfNotExist(telegramId, ctx.from.first_name, ctx.from.last_name, ctx.from.username, ctx.chat.id);
		if (accountExistsOrCreated) {
			await userVerboseLog(telegramId, 'already exists in database');
		}

		await selectChain(telegramId, 'ethereum')
		// try {
		// 	let chain = await getSelectedChain(telegramId)
		// } catch (err) {
		// 	const allChains = getAllChains()
		// 	await selectChain(telegramId, allChains[0])
		// }
		const chain = await getSelectedChain(telegramId)

		await updateChatId(telegramId, ctx.chat.id);

		try {
			if (ctx.update?.message?.text === undefined) {
				await ctx.deleteMessage();
			}
		} catch { }

		let w
		try {
			w = await getWallet(telegramId)
		} catch (err) { }

		if (ctx.chat.type === 'private') {
			if (w === undefined) {
				await createRandomWallet(telegramId)
			}
		} else {
			await ctx.telegram.sendMessage(ctx.chat.id, '❌ This bot is only allowed to use in private chat');
			return
		}

		await generateNewSecurityKey(telegramId)
		await ctx.telegram.sendMessage(ctx.chat.id, await startMessage(telegramId, chain), {
			parse_mode: botEnum.PARSE_MODE_V2,
			reply_markup: await markupStart(telegramId),
			// disable_web_page_preview: true
		});
	} catch (err) {
		await processError(ctx, telegramId, err)
	}
};

module.exports = (bot: any) => {
	bot.start(invokeStart);
	bot.action(botEnum.get1000chips.value, async (ctx: any) => {
		try {
			await ctx.answerCbQuery()
		} catch { }
		const telegramId = ctx.from.id
		const user = await getAppUser(telegramId)
		await addChips(user._id, 1000)
		await ctx.reply(`✅ Success`)
	})
};
