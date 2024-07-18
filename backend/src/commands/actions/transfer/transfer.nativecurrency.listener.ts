import { Scenes } from 'telegraf';
import { botEnum } from '../../../constants/botEnum';
import { processError } from '../../../service/error';
import Logging from '../../../utils/logging';
import { TRANSFER_NATIVE_CURRENCY_LISTENER } from '../../../utils/common';
import { ISceneResponse, SceneStageService } from '../../../service/scene.stage.service';
import { isValidAddress } from '../../../web3/web3.operation';
import { FREE_MODE, getChipCount, withdrawChips } from '../../../service/chip.service';
import { chainConfig } from '../../../web3/chain.config';

export const transferNativeCurrencyToListener = new Scenes.BaseScene(TRANSFER_NATIVE_CURRENCY_LISTENER);

// send a prompt message when user enters scene
transferNativeCurrencyToListener.enter(async (ctx: any) => {
    const telegramId = ctx.from.id;

    const context = {
        to: null,
        amount: null,
        inputType: ctx.scene.state.input_type,
        msgId: ctx.scene.state.msgId,
        chain: ctx.scene.state.chain,
		maxChips: 0
    };

    try {
        const chips = await getChipCount(telegramId)
		context.maxChips = chips

        const ret = await ctx.telegram.sendMessage(ctx.chat.id, `You currently have 🛢 ${chips} chips. How many chips would you like to cash out?`, {
            parse_mode: botEnum.PARSE_MODE_V2,
            reply_markup: {
                force_reply: true,
                input_field_placeholder: `${chips}`,
            }
        });

        try { await ctx.answerCbQuery() } catch { }

        await new SceneStageService().saveScene(telegramId, TRANSFER_NATIVE_CURRENCY_LISTENER, JSON.stringify(context), new Date());
        await ctx.scene.leave();
    } catch (err) {
        await processError(ctx, telegramId, err)
        await ctx.scene.leave()
    }
});

export class TransferNativeCurrencyToListener {
    public async processMessage(telegramId: string, sceneContext: ISceneResponse, text: string, ctx: any) {
        Logging.info(`TransferNativeCurrencyToListener.class processing scene message [${text}]`)
        const context = JSON.parse(sceneContext.scene.text)
        if (context.amount === null) {
            const chips = parseInt(text.toLowerCase())
            if (!isNaN(chips) && chips > 0 && chips <= context.maxChips) {
                await ctx.telegram.sendMessage(
                    ctx.chat.id,
                    `What address do you want to cash out 🛢 ${chips} chips to?`,
                    {
                        parse_mode: botEnum.PARSE_MODE_V2,
                        reply_markup: {
                            force_reply: true,
                            input_field_placeholder: '0x123456...abcdef',
                        }
                    }
                );
                context.amount = chips;

                await new SceneStageService().saveScene(telegramId, TRANSFER_NATIVE_CURRENCY_LISTENER, JSON.stringify(context), new Date());

            } else {
                await ctx.reply(`❌ Invalid chip count ${chips}`);
                await new SceneStageService().deleteScene(telegramId)
            }
        } else if (context.to == null) {
            try {
				context.to = text.toLowerCase()
				if (isValidAddress(context.to)) {
					if (FREE_MODE === true) {
						await ctx.reply(`😉 This is free mode. You can't withdraw chips`, {
							parse_mode: botEnum.PARSE_MODE_V2
						});
					} else {
						await ctx.telegram.sendMessage(ctx.chat.id, `Please wait while processing...`, { parse_mode: botEnum.PARSE_MODE_V2 });
						const tx = await withdrawChips(context.chain, context.to, context.amount)
						if (tx?.transactionHash) {
							console.log(`Withdraw success: ${chainConfig[context.chain].blockExplorer}/tx/${tx?.transactionHash}`)
							await ctx.reply(`✅ Success\n${chainConfig[context.chain].blockExplorer}/tx/${tx?.transactionHash}`, {
								parse_mode: botEnum.PARSE_MODE_V2
							});
						} else {
							await ctx.reply(`❌ Oops. Something went wrong`, {
								parse_mode: botEnum.PARSE_MODE_V2
							});
						}
					}
				}

                await new SceneStageService().deleteScene(telegramId);
            } catch (err) {
                await new SceneStageService().deleteScene(telegramId)
                await ctx.telegram.sendMessage(ctx.chat.id, `${err.message}`, { parse_mode: botEnum.PARSE_MODE_V2 })
                return;
            }
        }
    }
}

