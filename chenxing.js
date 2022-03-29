
const { sleep } = require('./sleep')
const { getPageText } = require('./ocr')
const { getPage, pages, pageType } = require('./pages')
const { AbstractTask } = require('./AbstractTask')
const { findAndClickRect, getRectCenter } = require('./rect')
const { tap } = require('./tap')
const { navigateTo } = require('./navigator')
const { range } = require('./range')
const { swipeHorizontally } = require('./swipe')

const __PageType__ = pageType.chenxing
class chenxingTask extends AbstractTask {

    constructor(gtCallback) {
        super(gtCallback)
        this.restCountToday = 5
    }

    isTimesRunout()
    {
        return this.restCountToday == 0
    }

    resetRestTimes()
    {
        this.restCountToday = 5
    }

    // 获取屏幕范围内的辰星等级
    getGradeRange(result) {
        var min = 300
        var max = 0
        let gs = []
        result.forEach((v, i)=>{
            if (v.text.includes('0级')) {
                let grade = v.text.substring(0, v.text.length - 1)
                grade = parseInt(grade)
                gs.push(grade)
                if (max < grade) {
                    max = grade
                }
            }
        })

        gs.forEach((v) => {
            // 避免文字被遮挡识别一半
            if (min > v && max - v < 100) {
                min = v
            }
        })
        return { min, max }
    }

    // 滑动到目标辰星
    async swipeToDest(g) {
        let _r = await getPageText({ x: 0, y: 60, width: 750, height: 780 })
        if (!_r.text.includes('天降辰星')) {
            await navigateTo(__PageType__)
            _r = await getPageText({ x: 0, y: 60, width: 750, height: 780 })
        }
        const { min, max } = this.getGradeRange(_r.result)
        const r = await new Promise((resolve, reject)=> {
            if ( g < min ) {
                swipeHorizontally()
                resolve(false)
            }else if (g > max) {
                swipeHorizontally(true)
                resolve(false)
            }
            resolve([ _r.text, _r.result ])
        })
        return r
    }

    async challengeChenxing(g) {
        for (let _ of range(1, 20)) {
            let _r = await this.swipeToDest(g)
            if (_r) {
                return true
            }
        }
        return false
    }
    
    async trigger(name, chenxingNotify) {
        await super.trigger(name)
        let _r = await navigateTo(__PageType__)
        if (_r.text && _r.text.includes('归属次数'))
        {
            let _find
            _r.result.forEach((v, i)=>{
                if (v.text.includes('归属次数')) {
                    _find = v
                }
            })

            if (_find) {
                let rest = _find.text.slice(-3, -2)
                console.log('rest chenxing count : ' + rest)
                if (parseInt(rest) == 0) {
                    this.restCountToday = 0
                    return this.generateTask()
                }
            }
        }

        let targetGrade
        if (chenxingNotify.includes('猪'))
        {
            targetGrade = '300级'
        }else if (chenxingNotify.includes('狗'))
        {
            targetGrade = '290级'
        }
        else if (chenxingNotify.includes('鸡'))
        {
            targetGrade = '280级'
            await this.challengeChenxing(280)
        }
        else if (chenxingNotify.includes('猴'))
        {
            targetGrade = '265级'
            await this.challengeChenxing(265)
        }
        else if (chenxingNotify.includes('羊'))
        {
            targetGrade = '250级'
            await this.challengeChenxing(250)
        }
        else {
            targetGrade = '230级'
            await this.challengeChenxing(230)
        }
        if (!targetGrade) {
            return this.generateTask()
        }
        // 13,197,724,752
        _r = await getPageText({ x: 0, y: 200, width: 750, height: 552 })
        if (_r.text.includes(targetGrade))
            this.findAndClickRect(_r, targetGrade, 0, -80)
        
        tap(620, 1020)
        
        _r = await getPageText()
        if (_r.text && _r.text.includes('挑战辰星'))
        {
            findAndClickRect(_r, '组队')
            let r_1 = await getPageText()
            findAndClickRect(r_1, '创建队伍')
            tap(675, 910)
            findAndClickRect(_r, '挑战辰星')
            for (let _ of range(1, 150)) {
                _r = await getPageText()
                if (_r.text && _r.text.includes('跳过战斗')) {
                    findAndClickRect(_r, '跳过战斗')
                }else if(_r.text && _r.text.includes('退出')) {
                    findAndClickRect(_r, '退出')
                    tap(540, 740)
                    this.toast(targetGrade + '完成')
                    return this.generateTask()
                }else if(_r.text && _r.text.includes('挑战归属者'))
                {
                    findAndClickRect(_r, '组队')
                    _r = await getPageText()
                    findAndClickRect(_r, '退出队伍')
                    tap(670, 1050)
                    tap(700, 880)
                    tap(540, 740)
                }
                sleep(2000)
            }
        }else if (getPage(_r) == __PageType__) {
        }
        else {
            tap(700, 880)
            tap(540, 740)
        }
        
        return this.generateTask()
    }
}

module.exports = {
    chenxingTask
}