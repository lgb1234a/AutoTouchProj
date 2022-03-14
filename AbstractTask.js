const { findAndClickRect, getRectCenter } = require('./rect')

class AbstractTask {
    constructor(gtCallback){
        this.generateTask = gtCallback
        this._isComplete = false
        this.getRectCenter = getRectCenter
        this.findAndClickRect = findAndClickRect
    }

    async trigger(name) {
        if (name) {
            console.log('--------trigger: ' + name)
        }
        let r = await new Promise((resolve, reject)=>{
            at.usleep(1000000)
            resolve()
        })
        return r
    }

    isComplete() {
        return this._isComplete
    }

    setIsComplete(v) {
        this._isComplete = v
    }

    isTimesRunout() {
        return false
    }

    toast(text) {
        console.log(text)
        at.toast(text, 'bottom')
    }
}

module.exports = {
    AbstractTask
}