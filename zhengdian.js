const { sleep } = require('./sleep')
const { getPageText } = require('./ocr')
const { getPage, pages, pageType } = require('./pages')
const { AbstractTask } = require('./AbstractTask')
const { navigateTo } = require('./navigator')
const { tap } = require('./tap')
const { swipeHorizontally, swipeVertically } = require('./swipe')

const __PageType__ = pageType.wanfa
class zhengdianTask extends AbstractTask {
    constructor(gtCallback) {
        super(gtCallback)
        // 11点开始飞贼，晚上19点开始演兵, 11点55  19点55小龟
    }

    hasTaskValid() {
        let now = new Date()
        let day = now.getDay()
        let hour = now.getHours()
        let mintue = now.getMinutes()

        if ((day == 1 || day == 5) && hour == 20 && mintue < 45) {
            return 'yingxiongdahui'
        }

        if ((day == 2 || day == 4) && hour == 20 && mintue < 30) {
            return 'caihong'
        }

        if ((day == 2 || day == 4) && hour == 21 && mintue < 30) {
            return 'bangzhan'
        }

        if ((day == 3 || day == 6) && hour == 20 && mintue < 30) {
            return 'gongfangzhan'
        }


        if (hour >= 11 && hour < 13) {
            return 'feizei'
        }

        if (hour == 19) {
            return 'yanbing'
        }

        if (hour == 11 && mintue >= 55 || hour == 19 && mintue >= 55) {
            return 'xiaogui'
        }
    }

    async taskStart(taskName) {
        const { text, result } = await navigateTo(__PageType__)
        if (!text) {
            return false
        }else if(getPage({ text, result }) != __PageType__){
            return false
        }

        // 45,195,706,929
        let _r = await getPageText({ x: 0, y: 195, width: 750, height: 735 })
        for (let _ of range(1, 5)) {
            if (_r.text.includes(taskName)) {
                let center = this.findAndClickRect(_r, taskName)
                if (center.y > 820) {
                    swipeVertically()
                }
                break;
            }
            swipeVertically()
            _r = await getPageText({ x: 0, y: 195, width: 750, height: 735 })
        }

        if (!_r.text.includes(taskName)) {
            return false
        }
        
        let _find
        _r.result.forEach((v, i) => {
            if (v.text == taskName) {
                _find = v
            }
        });

        if (!_find) {
            return false
        }

        let center = this.getRectCenter(_find.rectangle)
        _r = await getPageText({ x: 520, y: center.y + 30, width: 200, height: 65 })
        if (_r.text.includes('前往')) {
            this.findAndClickRect(_r, '前往')
            return true
        } else if (_r.text.includes('完成')) {
            
            return false
        }

        return false
    }


    async trigger(name) {
        await super.trigger(name)

        const { text, result } = await navigateTo(__PageType__)
        if (!text) {
            return this.generateTask()
        }else if(getPage({ text, result }) != __PageType__){
            return this.generateTask()
        }

        if (this.hasTaskValid() == 'feizei') {
            this.findAndClickRect({ text, result }, '限时')
            await this.taskStart('皇宫飞贼')
        }

        if (this.hasTaskValid() == 'yanbing') {
            this.findAndClickRect({ text, result }, '限时')
            await this.taskStart('校场演兵')
        }


        return this.generateTask()
    }
}

module.exports = {
	zhengdianTask
}