import { TransferNativeCurrencyToListener } from "../commands/actions/transfer/transfer.nativecurrency.listener";
import { TransferTokenTokenListener } from "../commands/actions/transfer/transfer.token.listener";
import { IAppUser } from "../models/app.user.model";
import { ISceneStage, SceneStageModel } from "../models/scene.stage.model";
import { TRANSFER_NATIVE_CURRENCY_LISTENER, TRANSFER_TOKEN_TOKEN_LISTENER } from "../utils/common";
import Logging from "../utils/logging";
import { getAppUser } from "./app.user.service";


export interface ISceneResponse {
    appUser?: IAppUser;
    scene?: ISceneStage
}

export class SceneStageService {
    public async getSceneStage(telegramId: string) {
        const user = await getAppUser(telegramId);
        let response: ISceneResponse = {};
        response.appUser = user
        await SceneStageModel.findOne({ owner: user._id.toString() }).then(res => {
            response.scene = res
        }).catch((err) => {
            console.error(`==> ${new Date().toLocaleString()}`)
            console.error(err)
            Logging.error(`[getSceneStage] ${err.message}`);
        });
        return response
    }


    public async saveScene(telegramId: string, name: string, text: string, updateDate: Date) {
        const user = await getAppUser(telegramId);
        if (0 === (await SceneStageModel.countDocuments({ owner: user._id }))) {
            const wallet = new SceneStageModel({
                owner: user._id,
                name: name,
                text: text,
                date: new Date(),
            });

            await wallet.save();
        } else {
            await SceneStageModel.findOneAndUpdate({ owner: user._id }, {
                name: name,
                text: text,
                date: updateDate,
            })
        }
    }

    public async deleteScene(telegramId: string) {
        const user = await getAppUser(telegramId);
        await SceneStageModel.deleteOne({ owner: user._id }).then(res => {
            return res;
        }).catch((err) => {
            console.error(`==> ${new Date().toLocaleString()}`)
            console.error(err)
            Logging.error(`[deleteScene] ${err.message}`);
        });
    }


    public async processSceneStage(telegramId: string, text: string, scene: ISceneResponse, ctx: any) {
        if (scene != null) {
            if (scene.scene.name === TRANSFER_NATIVE_CURRENCY_LISTENER) {
                await new TransferNativeCurrencyToListener().processMessage(telegramId, scene, text, ctx)
            }
            else if (scene.scene.name === TRANSFER_TOKEN_TOKEN_LISTENER) {
                await new TransferTokenTokenListener().processMessage(telegramId, scene, text, ctx)
            }
        }
    }
}