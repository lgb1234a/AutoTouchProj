const { getPageText } = require('./ocr')
const { AbstractTask } = require('./AbstractTask')
const { getPage, pages, pageType } = require('./pages')
const { navigateTo } = require('./navigator')

const __PageType__ = pageType.chenxing
class pendingTask extends AbstractTask {

    constructor(gtCallback) {
        super(gtCallback)
        this.count = 0
    }

    async trigger(appRestarted, chenxingTimeRanout) {
        await super.trigger()
        let now = new Date()
        let hour = now.getHours()
        if (chenxingTimeRanout || hour >= 2 && hour <= 7) {
            return this.generateTask()
        }

        if (appRestarted || this.count == 10) {
            // app闲置重启后或者闲置10s后，去辰星页面方便识别辰星通知
            await navigateTo(__PageType__)
        }

        // 辰星监控
        const {text, result} = await getPageText({ x: 0, y: 171, width: 750, height: 38 })
        if (text && text.includes('辰星')) {
            return this.generateTask(text)
        }
        
        this.count ++

        if (this.count > 600) {
            // 每闲置10分钟重启一次游戏
            this.count = 0
            this.toast('重启App')
            at.appKill("com.netease.mhxywyb")
        }
        return this.generateTask()
    }
}

module.exports = {
    pendingTask
}