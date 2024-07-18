import { Schema, model } from 'mongoose';

const appSchema = new Schema(
	{
		purgeMessages: { type: Boolean },
		chipPrice: { type: String },
	},
	{ timestamps: true }
);

export const AppModel = model('App', appSchema);
