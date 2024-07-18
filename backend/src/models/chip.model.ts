import { Schema, model } from 'mongoose';

const chipSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'AppUser' },
        chips: { type: Number, required: true }
    },
    { timestamps: true }
);

export const ChipModel = model('Chip', chipSchema);
