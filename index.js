// index.js is entrance of the package, you have to provide it.
// You can require other modules here

const { sleep } = require('./sleep')
const { yaowangTask } = require('./yaowang')
const { chenxingTask } = require('./chenxing')
const { dishaTask } = require('./disha')
const { pendingTask } = require('./pendingTask')
const { zhengdianTask } = require('./zhengdian')
const { richangTask } = require('./richang')

function appStateHandle() {
    const state = at.appState("com.netease.mhxywyb")
    if (state != 'ACTIVATED') {
        at.keyDown(KEY_TYPE.HOME_BUTTON)
        at.keyUp(KEY_TYPE.HOME_BUTTON)
        sleep(2000)
	    at.appRun("com.netease.mhxywyb")
        return true
    }
}

var yt = new yaowangTask(generateTask)
var dt = new dishaTask(generateTask)
var ct = new chenxingTask(generateTask)
var pt = new pendingTask(generateTask)
var zt = new zhengdianTask(generateTask)
var rt = new richangTask(generateTask)

function generateTask(isChenxing) {
    let appRestarted = appStateHandle()

    let now = new Date()
    let hour = now.getHours()
    let mintue = now.getMinutes()

    if (hour == 0) {
        // 进入第二天
        yt.resetRestTimes()
        ct.resetRestTimes()
		if (mintue < 5)
       		rt.resetCompleteStatus()
    }

    if (mintue >= 20 && mintue < 30 || mintue >= 50) {
        yt.setIsComplete(false)
    }

    if (hour == 11 && mintue == 0 || hour == 11 && mintue == 55 || hour == 19 && mintue == 0 || hour == 19 && mintue == 55) {
        zt.setIsComplete(false)
    }

    if (mintue < 30) {
        dt.setIsComplete(false)
    }

    if (hour % 2 == 0 && mintue > 28) {
        // 地煞
        if (!dt.isComplete()) {
            return dt.trigger('地煞')
        }
    }

    if (zt.hasTaskValid() && !zt.isComplete()) {
        return zt.trigger('整点')
    }

    if (!ct.isTimesRunout() && isChenxing) {
        return ct.trigger('辰星', isChenxing)
    }

    if ((mintue == 59 || mintue < 20) || mintue > 28 && mintue < 50) {
        if (!yt.isComplete() && !yt.isTimesRunout()) {
            return yt.trigger('妖王')
        }
    }

    if (!rt.isComplete() && hour < 9) {
        return rt.trigger('日常')
    }

    return pt.trigger(appRestarted, ct.isTimesRunout())
}


// if (yaowangSwitch.value == 0) yt.setTimesRanout()
// if (richangSwitch.value == 0) rt.setIsComplete(true)
at.toast('脚本开始！', 'bottom')
appStateHandle()
sleep(5000)
generateTask()
