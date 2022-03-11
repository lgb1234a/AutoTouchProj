

function getRectCenter(rect) {
    let minX = rect.topLeft.x
    let maxX = rect.bottomRight.x
    let x = (minX + maxX) * 0.5

    let minY = rect.bottomRight.y
    let maxY = rect.topLeft.y
    let y = (minY + maxY) * 0.5
    return { x, y }
}

module.exports = {
    getRectCenter
}