
const { sleep } = require('./sleep')
function tap(x, y) {
    at.touchDown(0, x, y)
    sleep(16)
    at.touchUp(0, x, y)
    sleep(2000)
}

module.exports = {
    tap
}