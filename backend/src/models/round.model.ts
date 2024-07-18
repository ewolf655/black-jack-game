import { Schema, model } from 'mongoose';

const roundSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'AppUser' },
		deck: [{ type: Number }],
		dealer: [{ type: Number }],
		player: [{ type: Number }],
		state: { type: String },
		chips: { type: Number },
		hand: { type: String }, // 'player' or 'dealer'
		dealerHand: { type: Number },
		playerHand: { type: Number },
		result: { type: String },
	},
	{ timestamps: true }
);

export const RoundModel = model('Round', roundSchema);
