const mongoose = require('mongoose')

const getUserServiceData = async (userId, serviceName) => {
	const user = await mongoose.model('User')
		.findById(userId)
		.exec()
	user.data = user.data || {}
	return user.data[serviceName]
}

module.exports = {
	getUserServiceData
}
