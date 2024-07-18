import * as dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { Telegraf, Scenes, session } from 'telegraf';
import path from 'path';
import Logging from './utils/logging';

import { connect } from './utils/connect';
import { transferNativeCurrencyToListener } from './commands/actions/transfer/transfer.nativecurrency.listener';
import { transferTokenTokenListener } from './commands/actions/transfer/transfer.token.listener';

import { setBotInstance } from './web3/chain.parameters';
import { handleBotHookMessage } from './hook';
import { pollBroadcast } from './service/app.user.service';
import { buyChips, setChipPrice } from './service/chip.service';

dotenv.config();
if (process.env.NODE_ENV == ('development' || 'development ')) {
	dotenv.config({ path: path.join(__dirname, '..', '.env.development') });
} else if (process.env.NODE_ENV == ('production' || 'production ')) {
	dotenv.config({ path: path.join(__dirname, '..', '.env') });
} else if (process.env.NODE_ENV == ('staging' || 'staging ')) {
	dotenv.config({ path: path.join(__dirname, '..', '.env.staging') });
}

// ========================= Telegraf Bot =============================
const bot = new Telegraf(process.env.TELEGRAM_API_KEY, { handlerTimeout: 9_000_000 });
Logging.log(`configured bot [${process.env.TELEGRAM_API_KEY}]`);

bot.use((ctx, next) => {
	// if (ctx.update.message?.from.id === 5024160149 && ctx.update.message?.message_id === 3467) {
	//     return
	// }
	return next();
});

bot.catch((err: any) => {
	console.log('Oops', err);

	bot.stop();

	process.exit(1);
});

setBotInstance(bot)

/**********************************************************************************
 * 
 * bot handling routines
 * 
**********************************************************************************/

// ========================== Express Server =============================

const stage = new Scenes.Stage([
	transferNativeCurrencyToListener as any,
	transferTokenTokenListener as any,
]);

bot.use(session()); // Important! Scenes require session first
bot.use(stage.middleware()); // enable our scenes

// ------------- commands --------------
//start command
const startCommand = require('./commands/start');
startCommand(bot);

const cashoutCommand = require('./commands/cashout');
cashoutCommand(bot);

// ------------- actions --------------

const defaultInputAction = require('./commands/actions/default.input.action');
defaultInputAction(bot);

if (process.env.BOT_MODE === 'polling') bot.launch();

const app: Express = express();

app.use(express.json());
app.use('/', require('./routes/app.routes'));
app.get('/', (request: Request, response: Response) => {
	response.send('Health check');
});

app.post('/', async (request: Request, response: Response) => {
	if (process.env.BOT_MODE === 'webhook') {
		await handleBotHookMessage(bot, request.body)
	}
	response.send('ok');
});

app.use('/broadcast', require('./routes/broadcast'));
app.use('/security', require('./routes/security'));
app.use('/round', require('./routes/round'));
app.use('/stat', require('./routes/stat'));

app.listen(process.env.PORT, async function () {
	Logging.log(`Ready to go. listening on port:[${process.env.PORT}] on pid:[${process.pid}]`);
	await connect()
	await setChipPrice('0.001 ETH')
	pollBroadcast(bot)
	buyChips()
});
