function swipeHorizontally(showRight) {
	if (showRight) {
		at.touchDown(1, 440, 300)
		for (let x = 440; x >= 400; x -= 5) {
			at.usleep(8000)
			at.touchMove(1, x, 300)
		}
		at.touchUp(1, 400, 300)
	}else {
		at.touchDown(1, 400, 300)
		for (let x = 400; x <= 440; x += 5) {
			at.usleep(8000)
			at.touchMove(1, x, 300)
		}
		at.touchUp(1, 440, 300)
	}
	at.usleep(2000000)
}
// swipeHorizontally(true)
module.exports = {
	swipeHorizontally
}