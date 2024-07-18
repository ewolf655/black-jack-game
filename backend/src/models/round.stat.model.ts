import { Schema, model } from 'mongoose';

const roundStatSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'AppUser' },
		chips: { type: Number },
		profit: { type: Number },
		lose: { type: Number },
		highScore: { type: Number },
		playedTimes: { type: Number },
		winTimes: { type: Number },
		loseTimes: { type: Number },
		wager: { type: Number }
	},
	{ timestamps: true }
);

export const RoundStatModel = model('RoundStat', roundStatSchema);
