import { Router, Request, Response } from 'express';
import { isSecurityValid } from '../service/security.service';
import { getChipCount } from '../service/chip.service';
import { createNewRound, doubleDownRound, endRound, getPlayingRound, hitRound, standRound } from '../service/round.service';

const router = Router();

router.post('/new', async (request: Request, response: Response) => {
    const { telegramId, key, chips } = request.body

	try {
		if (true === await isSecurityValid(telegramId.toString(), key.toString())) {
			await createNewRound(telegramId.toString(), chips)
			response.send({status: true, round: await getPlayingRound(telegramId.toString())})
		} else {
			response.send({status: false, error: 'Security key is invalid'})
		}
	} catch (err) {
		response.send({status: false, error: err.message})
	}
});

router.get('/chip', async (request: Request, response: Response) => {
	const { telegramId, key } = request.query

	try {
		if (true === await isSecurityValid(telegramId.toString(), key.toString())) {
			response.send({status: true, chips: await getChipCount(telegramId.toString())})
		} else {
			response.send({status: false, error: 'Security key is invalid'})
		}
	} catch (err) {
		response.send({status: false, error: err.message})
	}
})

router.post('/stand', async (request: Request, response: Response) => {
    const { telegramId, key } = request.body

	try {
		if (true === await isSecurityValid(telegramId.toString(), key.toString())) {
			await standRound(telegramId.toString())
			response.send({status: true, round: await getPlayingRound(telegramId.toString())})
		} else {
			response.send({status: false, error: 'Security key is invalid'})
		}
	} catch (err) {
		response.send({status: false, error: err.message})
	}
});

router.post('/hit', async (request: Request, response: Response) => {
    const { telegramId, key } = request.body

	try {
		if (true === await isSecurityValid(telegramId.toString(), key.toString())) {
			await hitRound(telegramId.toString())
			response.send({status: true, round: await getPlayingRound(telegramId.toString())})
		} else {
			response.send({status: false, error: 'Security key is invalid'})
		}
	} catch (err) {
		response.send({status: false, error: err.message})
	}
});

router.post('/double-down', async (request: Request, response: Response) => {
    const { telegramId, key } = request.body

	try {
		if (true === await isSecurityValid(telegramId.toString(), key.toString())) {
			await doubleDownRound(telegramId.toString())
			response.send({status: true, round: await getPlayingRound(telegramId.toString()), chips: await getChipCount(telegramId.toString())})
		} else {
			response.send({status: false, error: 'Security key is invalid'})
		}
	} catch (err) {
		response.send({status: false, error: err.message})
	}
});

router.post('/end', async (request: Request, response: Response) => {
    const { telegramId, key } = request.body

	try {
		if (true === await isSecurityValid(telegramId.toString(), key.toString())) {
			await endRound(telegramId.toString())
			response.send({status: true, round: await getPlayingRound(telegramId.toString()), chips: await getChipCount(telegramId.toString())})
		} else {
			response.send({status: false, error: 'Security key is invalid'})
		}
	} catch (err) {
		response.send({status: false, error: err.message})
	}
});

module.exports = router;
