
const { sleep } = require('./sleep')
const { getPageText } = require('./ocr')
const { getPage, pages, pageType } = require('./pages')
const { AbstractTask } = require('./AbstractTask')
const { findAndClickRect, getRectCenter } = require('./rect')
const { tap } = require('./tap')
const { navigateTo } = require('./navigator')

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
        if (!targetGrade) {
            return this.generateTask()
        }
        // 13,197,724,752
        _r = await getPageText({ x: 0, y: 200, width: 750, height: 552 })
        this.findAndClickRect(_r, targetGrade, 0, -80)
        tap(620, 1020)
        
        _r = await getPageText()
        if (_r.text && _r.text.includes('挑战辰星'))
        {
            findAndClickRect(_r, '挑战辰星')
            let i = 0
            while(i++ < 150) {
                _r = await getPageText()
                if (_r.text && _r.text.includes('跳过战斗')) {
                    findAndClickRect(_r, '跳过战斗')
                }else if(_r.text && _r.text.includes('退出')) {
                    findAndClickRect(_r, '退出')
                    this.toast(targetGrade + '完成')
                    return this.generateTask()
                }else if(_r.text && _r.text.includes('挑战归属者'))
                {
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