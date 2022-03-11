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

    async trigger(appRestarted) {
        await super.trigger()
        if (appRestarted) {
            // 去辰星页面方便识别辰星通知
            await navigateTo(__PageType__)
        }

        let now = new Date()
        let hour = now.getHours()
        if (hour < 2 || hour > 7) {
            // 辰星监控
            const {text, result} = await getPageText({ x: 0, y: 171, width: 750, height: 38 })
            if (text) {
                if (text.includes('前往')) {
                    console.log(text)
                }
                
                if (text.includes('猪辰星')) {
                    return this.generateTask('zhu')
                }

                if (text.includes('狗辰星')) {
                    return this.generateTask('gou')
                }
            }
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