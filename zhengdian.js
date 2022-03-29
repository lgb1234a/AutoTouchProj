const { sleep } = require('./sleep')
const { getPageText } = require('./ocr')
const { getPage, pages, pageType } = require('./pages')
const { AbstractTask } = require('./AbstractTask')
const { navigateTo } = require('./navigator')
const { tap } = require('./tap')
const { swipeHorizontally, swipeVertically } = require('./swipe')
const { range } = require('./range')

const __PageType__ = pageType.wanfa
const __YINGXIONGDAHUI__ = '英雄大会'
const __CAIHONG__ = '彩虹争霸'
const __BANGZHAN__ = '跨服帮战'
const __GONGFANGZHAN = '梦幻攻防战'
const __FEIZEI__ = '皇宫飞贼'
const __YANBING__ = '校场演兵'
const __XIAOGUI__ = '小龟快跑'
class zhengdianTask extends AbstractTask {
    constructor(gtCallback) {
        super(gtCallback)
        // 11点开始飞贼，晚上19点开始演兵, 11点55  19点55小龟
        this._yanbingComplete = false
        this._feizeiComplete = false
        this._bangzhanComplete = false
        this._caihongComplete = false
    }

    hasTaskValid() {
        let now = new Date()
        let day = now.getDay()
        let hour = now.getHours()
        let mintue = now.getMinutes()

        if ((day == 1 || day == 5) && hour == 20 && mintue < 45) {
            return __YINGXIONGDAHUI__
        }

        if ((day == 2 || day == 4) && hour == 20 && mintue < 30) {
            if (!this._caihongComplete)
                return __CAIHONG__
        }

        if ((day == 2 || day == 4) && (hour == 21 && mintue < 30 || hour == 20 && mintue > 50)) {
            if (!this._bangzhanComplete)
                return __BANGZHAN__
        }

        if ((day == 3 || day == 6) && hour == 20 && mintue < 30) {
            return __GONGFANGZHAN
        }


        if (hour >= 11 && hour < 13 && !this._feizeiComplete) {
            return __FEIZEI__
        }

        if (hour == 19 && !this._yanbingComplete) {
            return __YANBING__
        }

        if (hour == 11 && mintue >= 55 || hour == 19 && mintue >= 55) {
            return __XIAOGUI__
        }
    }

    async taskStart(taskName) {
        this.toast('找' + taskName)
        const { text, result } = await navigateTo(__PageType__)
        if (!text) {
            return false
        }else if(getPage({ text, result }) != __PageType__){
            return false
        }
        this.findAndClickRect({ text, result }, '限时')
        
        // 45,195,706,929
        let _r = await getPageText({ x: 0, y: 195, width: 750, height: 735 })
        
        for (let i of range(1, 8)) {
            if (_r.text.includes(taskName)) {
                let center = this.findAndClickRect(_r, taskName)
                if (center.y > 820) {
                    swipeVertically()
                }
                break;
            }
            swipeVertically()
            if (i % 3 == 0) {
                sleep(1000)
                swipeVertically(true)
            }
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
            this._feizeiComplete = true
            return this.generateTask()
        }

        return false
    }


    async trigger(name) {
        await super.trigger(name)

        if (this.hasTaskValid() == __FEIZEI__) {
            let r = await this.taskStart(__FEIZEI__)
            if (r) {
                sleep(1000 * 1000)
                this._feizeiComplete = true
            }
        }

        if (this.hasTaskValid() == __YANBING__) {
            let r = await this.taskStart(__YANBING__)
            if (r) {
                sleep(1000 * 1000)
                this._yanbingComplete = true
            }
        }

        if (this.hasTaskValid() == __BANGZHAN__) {
            this.toast(__BANGZHAN__)
            let r = await navigateTo(pageType.guaji)
            if (!r.text.includes(__BANGZHAN__))
            {
                return this.generateTask()
            }
            tap(55, 222)
            let now = new Date()
            let hour = now.getHours()
            let mintue = now.getMinutes()
            while (hour <= 21 && mintue < 30) {
                now = new Date()
                hour = now.getHours()
                mintue = now.getMinutes()
                sleep(60000)
            }
            this._bangzhanComplete = true
        }

        if (this.hasTaskValid() == __CAIHONG__) {
            let r = await this.taskStart(__CAIHONG__)
            if (r) {
                let now = new Date()
                let hour = now.getHours()
                let mintue = now.getMinutes()
                while (hour <= 20 && mintue < 30) {
                    now = new Date()
                    hour = now.getHours()
                    mintue = now.getMinutes()

                    tap(535, 450)
                    sleep(12000)
                    r = await getPageText()
                    if (r.text.includes('是的'))
                        this.findAndClickRect(r, '是的')

                    // sleep(40000)
                }
                this._caihongComplete = true
            }
        }

        return this.generateTask()
    }
}

module.exports = {
	zhengdianTask
}