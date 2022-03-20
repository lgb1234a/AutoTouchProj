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

function swipeVertically(showUp) {
	if (showUp) {
		at.touchDown(1, 170, 540)
		for (let y = 540; y <= 600; y += 2) {
			at.usleep(10000)
			at.touchMove(1, 170, y)
		}
		at.touchUp(1, 170, 600)
	}else {
		at.touchDown(1, 170, 600)
		for (let y = 600; y >= 540; y -= 5) {
			at.usleep(10000)
			at.touchMove(1, 170, y)
		}
		at.touchUp(1, 170, 540)
	}
	at.usleep(2000000)
}


// swipeVertically(true)
module.exports = {
	swipeHorizontally, swipeVertically
}