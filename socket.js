import io from 'socket.io-client'

let socket = io.connect('ws://localhost:3001')
let user = uni.getStorageSync('user')

socket.on('connect', () => {
	console.log('建立连接')
	/* socket.emit('message', {
		from: user._id,
		to: user._id,
		content: 'hello'
	}) */
})
socket.on('disconnect', () => {
	console.log('断开连接')
})
socket.on('message', async (data) => {
	console.log(data)
	uni.setTabBarBadge({
	  index: 1,
	  text: data.unread + '',
		fail(err) {
			console.error(err)
		}
	})
})
module.exports = socket