import { botEnum } from '../constants/botEnum';
import { TransactionBackupModel } from '../models/transaction.backup.model';
import { TransactionHistoryModel } from '../models/transaction.history.model';
import { getBlockExplorer } from '../web3/chain.parameters';
import { getBN, sendTxnAdvanced } from '../web3/web3.operation';
import { getAppUser } from './app.user.service';
import { updateUserState } from './stat.service';

export async function newTransactionBackup(info: any) {
    const { telegramId, chain, to, data, value, address, gasPrice, label, exInfo } = info;

    const user = await getAppUser(telegramId);
    const newItem = new TransactionBackupModel({
        user: user._id,
        chain: chain,
        to: to.toLowerCase(),
        data: data,
        address: address ? JSON.stringify(address) : undefined,
        value: value,
        gasPrice: gasPrice ? parseFloat(gasPrice) : undefined,
        exInfo: JSON.stringify(exInfo)
    });

    await newItem.save();

    const findItems = await TransactionBackupModel.find({ user: user._id, chain: chain });
    if (findItems.length === 0) {
        throw new Error('Unexpected database error while appending a new transaction backup');
    }

    return await TransactionBackupModel.findById(findItems[findItems.length - 1]._id);
}

export async function updateTransactionBackup(id: any, updateInfo: any) {
    const tFound = await TransactionBackupModel.findById(id);
    if (updateInfo['transaction']) {
        const txFound = await TransactionHistoryModel.findOne({ chain: tFound.chain, transactionHash: updateInfo['transaction'] });
        updateInfo['transaction'] = txFound._id;
    }
    await TransactionBackupModel.findByIdAndUpdate(id, updateInfo);
}

export async function getTransactionBackup(telegramId: string, msgId: number) {
    const user = await getAppUser(telegramId);
    return await TransactionBackupModel.findOne({ user: user._id, msgId: msgId });
}

export async function getTransactionBackupById(id: any) {
    return await TransactionBackupModel.findById(id);
}

export function getTxCallback(label: string, success?: string) {
    const callback = async (bot: any, info: any, state: string) => {
        const { telegramId, chain, to, data, value, address, gasPrice, msgId, tx, error, exInfo } = info;

        let msgRet;
        if (state === 'pending') {
            const newBck: any = await newTransactionBackup(info);

            await newBck.populate('user');

            let labelTx = label
            if (tx) {
                const exp = await getBlockExplorer(chain)
                labelTx += `\n<i>Pending</i>\n${exp}/tx/${tx}`
            }

            msgRet = await bot.telegram.sendMessage(newBck.user.chatId, labelTx, {
                parse_mode: botEnum.PARSE_MODE_V2
            });

            await updateTransactionBackup(newBck._id, {
                msgId: msgRet.message_id,
                label: label
            });
        } else if (state === 'finished') {
            const bck: any = await getTransactionBackup(telegramId, msgId);
            await bck.populate('user');

            await updateTransactionBackup(bck._id, {
                transaction: tx,
                error: ''
            });

            const exp = await getBlockExplorer(bck.chain);

            try {
                await bot.telegram.editMessageText(bck.user.chatId, bck.msgId, 0, `${bck.label}\n${success ? success : '<i>Success</i>'}\n${exp}/tx/${tx}`, {
                    parse_mode: botEnum.PARSE_MODE_V2
                });
            } catch { }
        } else if (state === 'error') {
            const bck: any = await getTransactionBackup(telegramId, msgId);
            await bck.populate('user');

            await updateTransactionBackup(bck._id, {
                error: error.message
            });

            const nFound = error.message.indexOf("execution reverted: ")
            let errString = error.message
            if (nFound > -1) {
                errString = error.message.slice(nFound + 20)
            }

            try {
                await bot.telegram.editMessageText(
                    bck.user.chatId,
                    bck.msgId,
                    0,
                    `${bck.label}
<b>${errString}</b>`,
                    {
                        parse_mode: botEnum.PARSE_MODE_V2
                    }
                );
            } catch { }
        }

        return msgRet;
    };

    return callback;
}
