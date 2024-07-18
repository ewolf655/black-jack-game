import random from 'random-string-generator'
import { getAppUser } from './app.user.service'
import { SecurityModel } from '../models/security.model'

export async function generateNewSecurityKey(telegramId: string) {
	const appuser = await getAppUser(telegramId)
	const item = await SecurityModel.findOne({ user: appuser._id })
	const key = random()
	if (item === null) {
		const newItem = new SecurityModel({
			user: appuser._id,
			key: key
		})
		await newItem.save()
	} else {
		item.key = key
		await item.save()
	}
}

export async function getSecurityKey(telegramId: string) {
	const appuser = await getAppUser(telegramId)
	const item = await SecurityModel.findOne({ user: appuser._id })
	if (item === null) {
		throw new Error('Not found security key')
	}
	return item.key
}

export async function isSecurityValid(telegramId: string, key: string) {
	const dbKey = await getSecurityKey(telegramId)
	return key === dbKey
}
