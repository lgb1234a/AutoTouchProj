const { sleep } = require('./sleep')
const { getPageText } = require('./ocr')
const { getPage, pages, pageType } = require('./pages')
const { AbstractTask } = require('./AbstractTask')
const { navigateTo } = require('./navigator')
const { tap } = require('./tap')
const { swipeHorizontally } = require('./swipe')

const __PageType__ = pageType.yaowang
class yaowangTask extends AbstractTask {
    
    constructor(gtCallback) {
        super(gtCallback)
        this.restCountToday = 100
        // 根据剩余的妖王令判断要杀哪些地煞
        this.restTickets = 0
        this.grades = []
    }

    // 获取屏幕范围内的妖王等级
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

    // 滑动到目标妖王
    async swipeToDest(g) {
        let _r = await getPageText({ x: 0, y: 60, width: 750, height: 720 })
        if (!_r.text.includes('封印妖王')) {
            await navigateTo(__PageType__)
            _r = await getPageText({ x: 0, y: 60, width: 750, height: 720 })
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

    // 挑战妖王
    async challengeYaowang(gr)
    {
        var text, result
        while(true) {
            let r = await this.swipeToDest(gr)
            if (r) {
                text = r[0]
                result = r[1]
                break
            }
        }

        // 在妖王页等到30分或0分
        let now = new Date()
        let mintue = now.getMinutes()
        while(mintue == 59 || mintue == 29) {
            sleep(1000)
            now = new Date()
            mintue = now.getMinutes()
        }

        let index = this.grades.indexOf(gr)
        var g = gr + '级'
        if (text.includes(g)) {
            this.toast('start: ' + g)
            var _find
            result.forEach((v, i)=>{
                if (v.text == g) {
                    _find = v
                }
            })

            const {x, y} = this.getRectCenter(_find.rectangle)
            tap(x, y - 50)
            // 点击妖王再识别
            let _r = await getPageText({ x: 420, y: 1000, width: 200, height: 90 })
            
            if (!_r.text.includes('抢夺归属') && !_r.text.includes('未刷新') && !_r.text.includes('已封印') ) {
                tap(515, 1030)

                if (gr <= 130) {
                    sleep(3000)
                }else if (gr < 220) {
                    sleep(8000)
                }else {
                    sleep(25000)
                }
                
                // 点掉奖励弹窗
                tap(375, 90)
            }
            
            this.restCountToday--
            this.grades.splice(index, 1)
        }

        await new Promise((resolve, reject)=> {
            resolve()
        })
    }

    setTimesRanout() {
        this.restCountToday = 0
    }

    isTimesRunout()
    {
        return this.restCountToday == 0
    }

    resetRestTimes()
    {
        this.restCountToday = 100
    }

    // 触发入口
    async trigger(name)
    {
        await super.trigger(name)
        const { text, result } = await navigateTo(__PageType__)
        if (!text) {
            return this.generateTask()
        }else if(getPage({ text, result }) != __PageType__){
            return this.generateTask()
        }
        result.forEach((v, i)=>{
            if (v.text.includes('剩余获取归属奖励次数：'))
            {
                let _ts = v.text.split('：')
                let rct = _ts[1].split('/')[0]
                this.restCountToday = parseInt(rct)
            }else if (v.text.includes('/'))
            {
                let rt = v.text.split('/')[0]
                this.restTickets = parseInt(rt)
            }
        })
        console.log('rest today: ' + this.restCountToday + ' / rest ticket: ' + this.restTickets)

        if (this.restCountToday > 0) {
            
            if (this.restTickets >= 900) {
                // 挑战 200 ~ 300
                this.grades = [190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300]
            } else
            if (this.restTickets >= 20) {
                // 挑战130~190
                this.grades = [130, 140, 150, 160, 170, 180, 190, 200, 210]
            }else {
                // 挑战50 ~ 130
                this.grades = [50, 60, 70, 80, 90, 100, 110, 120, 130]
            }
        }else {
            return this.generateTask()
        }

        var i = this.grades.length
        while (this.restCountToday > 0) {
            if (i == 0) {
                i = this.grades.length
            }
            const g = this.grades[i - 1]
            await this.challengeYaowang(g)
            if (this.grades.length == 0) {
                this.toast('妖王结束')
                this.setIsComplete(true)
                return this.generateTask()
            }
            i--

            let now = new Date()
            let mintue = now.getMinutes()
            if (mintue >= 20 && mintue < 30 || mintue >= 50) {
                break
            }
        }
        return this.generateTask()
    }
}

module.exports = {
	yaowangTask
}