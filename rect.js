const { sleep } = require('./sleep')
const { tap } = require('./tap')

function getRectCenter(rect) {
    let minX = rect.topLeft.x
    let maxX = rect.bottomRight.x
    let x = (minX + maxX) * 0.5

    let minY = rect.bottomRight.y
    let maxY = rect.topLeft.y
    let y = (minY + maxY) * 0.5
    return { x, y }
}


function findAndClickRect(r, flag, offsetX, offsetY) {
    let ox = offsetX ? offsetX : 0
    let oy = offsetY ? offsetY : 0
    r.result.forEach((v, i)=>{
        if (v.text.includes(flag)) {
            let { x, y} = getRectCenter(v.rectangle)
            tap(x + ox, y + oy)
        }
    })
    sleep(2000)
}

module.exports = {
    findAndClickRect, getRectCenter
}