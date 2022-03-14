// index.js is entrance of the package, you have to provide it.
// You can require other modules here

const { sleep } = require('./sleep')
const { yaowangTask } = require('./yaowang')
const { chenxingTask } = require('./chenxing')
const { dishaTask } = require('./disha')
const { pendingTask } = require('./pendingTask')

function appStateHandle() {
    const state = at.appState("com.netease.mhxywyb")
    if (state != 'ACTIVATED') {
	    at.appRun("com.netease.mhxywyb")
        return true
    }
}

var yt = new yaowangTask(generateTask)
var dt = new dishaTask(generateTask)
var ct = new chenxingTask(generateTask)
var pt = new pendingTask(generateTask)

function generateTask(isChenxing) {
    let appRestarted = appStateHandle()

    let now = new Date()
    let hour = now.getHours()
    let mintue = now.getMinutes()

    if (hour == 0) {
        // 进入第二天
        yt.resetRestTimes()
        ct.resetRestTimes()
    }

    if (mintue >= 20 && mintue < 30 || mintue >= 50) {
        yt.setIsComplete(false)
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

    if ((mintue == 59 || mintue < 20) || mintue > 28 && mintue < 50) {
        if (!yt.isComplete() && !yt.isTimesRunout()) {
            return yt.trigger('妖王')
        }
    }
    
    if (!ct.isTimesRunout() && isChenxing) {
        return ct.trigger('辰星', isChenxing)
    }
    return pt.trigger(appRestarted, ct.isTimesRunout())
}

//------------------------ ui --------------------------------//
const label = { type: CONTROLLER_TYPE.LABEL, text: "mhxyh5辅助" }

const developerSwitch = { type: CONTROLLER_TYPE.SWITCH, title: "A Developer:", key: "ADeveloper", value: 1 }
const btn1 = { type: CONTROLLER_TYPE.BUTTON, title: "开始", color: 0x71C69E, flag: 1, collectInputs: true }
const btn2 = { type: CONTROLLER_TYPE.BUTTON, title: "取消", color: 0xFF5733, flag: 2, collectInputs: true }

const controls = [label, developerSwitch, btn1, btn2]

const result = at.dialog({ controls })


if (result == 1) {
    at.toast('脚本开始！', 'bottom')
    appStateHandle()
	sleep(5000)
	
    generateTask()
}