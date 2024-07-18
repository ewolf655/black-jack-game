import { Schema, model } from 'mongoose';

const securitySchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'AppUser' },
        key: { type: String, required: true }
    },
    { timestamps: true }
);

export const SecurityModel = model('Security', securitySchema);
