import { Router, Request, Response } from 'express';
import { isSecurityValid } from '../service/security.service';
import { getPlayingRound } from '../service/round.service';
import { getLeaderboard } from '../service/round.stat.service';

const router = Router();

router.get('/leaderboard', async (request: Request, response: Response) => {
    const { telegramId, key } = request.query

	try {
		if (true === await isSecurityValid(telegramId.toString(), key.toString())) {
			const leaderboard = await getLeaderboard()
			response.send({status: true, leaderboard: leaderboard})
		} else {
			response.send({status: false, error: 'Security key is invalid'})
		}
	} catch (err) {
		console.error(err)
		response.send({status: false, error: err.message})
	}
});

module.exports = router;
