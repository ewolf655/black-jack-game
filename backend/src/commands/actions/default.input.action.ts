import { message } from 'telegraf/filters';
import { userVerboseLog } from '../../service/app.user.service';
import { processError } from '../../service/error';
import { ISceneResponse, SceneStageService } from '../../service/scene.stage.service';
import { DEFAULT_SCENE_TIMEOUT } from '../../utils/common';

module.exports = (bot: any) => {
    bot.on(message('text'), async (ctx: any) => {
        const telegramId = ctx.from.id

        try {
            await userVerboseLog(telegramId, `processing text message: ${ctx.message.text}`)
            const tickStart = (new Date()).getTime()

            let processedByScene = false;
            const scene: ISceneResponse = await new SceneStageService().getSceneStage(telegramId);
            if (scene != null && scene.appUser != null && scene.scene != null) {
                const sceneStageCreatedDate = scene.scene.date.setSeconds(scene.scene.date.getSeconds() + DEFAULT_SCENE_TIMEOUT) // add 60 secs
                const createdDate = new Date(sceneStageCreatedDate)
                if (createdDate >= new Date()) {
                    processedByScene = true;
                    await new SceneStageService().processSceneStage(telegramId, ctx.message.text, scene, ctx)
                } else {
                    await new SceneStageService().deleteScene(telegramId)
                }
            }
        } catch (err) {
            await processError(ctx, telegramId, err)
        }
    })
}
