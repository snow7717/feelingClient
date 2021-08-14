import io from 'socket.io-client'

let user = uni.getStorageSync('user')
let socket = io.connect('ws://localhost:3001')

socket.on('connect', () => {
	socket.emit('login',{
		user: user._id
	})
})
socket.on('disconnect', () => {
	console.log('断开连接')
})
socket.on('message', async (data) => {
	uni.setStorageSync('unread',data.unread)
	uni.setTabBarBadge({
	  index: 1,
	  text: data.unread + '',
		fail(err) {
			console.error(err)
		}
	})
})
socket.on('friendreq',(data) => {
	uni.setStorageSync('count',data.count)
	uni.setTabBarBadge({
	  index: 2,
	  text: data.count + '',
		fail(err) {
			console.error(err)
		}
	})
})

module.exports = socket