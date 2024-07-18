import { Router, Request, Response } from 'express';
import { isSecurityValid } from '../service/security.service';
import { getPlayingRound } from '../service/round.service';

const router = Router();

router.get('/', async (request: Request, response: Response) => {
    const { telegramId, key } = request.query

	try {
		if (true === await isSecurityValid(telegramId.toString(), key.toString())) {
			const round = await getPlayingRound(telegramId.toString())
			response.send({status: true, round: round})
		} else {
			response.send({status: false, error: 'Security key is invalid'})
		}
	} catch (err) {
		response.send({status: false, error: err.message})
	}
});

module.exports = router;
