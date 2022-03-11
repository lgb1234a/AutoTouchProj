function sleep(seconds)
{
	// 毫秒
	at.usleep(seconds * 1000)
}

module.exports = {
	sleep
}