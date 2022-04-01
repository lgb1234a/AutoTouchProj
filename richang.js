const { sleep } = require('./sleep')
const { getPageText } = require('./ocr')
const { getPage, pages, pageType } = require('./pages')
const { AbstractTask } = require('./AbstractTask')
const { navigateTo } = require('./navigator')
const { tap } = require('./tap')
const { swipeHorizontally, swipeVertically } = require('./swipe')
const { range } = require('./range')

const __PageType__ = pageType.wanfa
const __ZHUOGUI__ = '钟馗捉鬼'
const __ZHONGZU__ = '种族任务'
const __JUQING__ = '剧情挑战'
const __YUNBIAO__ = '运镖'
const __FUBEN__ = '副本任务'
const __HUASHAN__ = '决战华山'
const __YANTADIGONG__ = '雁塔地宫'
const __BAIHUTANG__ = '白虎堂任务'
const __QINGLONGTANG__ = '青龙堂任务'
const __XUANWUTANG__ = '玄武堂任务'
const __SHOUHUSHOU__ = '帮派守护兽'
const __QIANGDAO__ = '帮派除盗'
const __SHENQI__ = '神器任务'

class richangTask extends AbstractTask {
    constructor(gtCallback) {
        super(gtCallback)
        this._zhuoguiComplete = false
        this._zhongzuComplete = false
        this._yunbiaoComplete = false
        this._juqingComplete = false
        this._fubenComplete = false
        this._huashanComplete = false
        this._yantadigongComplete = false
        this._baihutangComplete = false
        this._qinglongtangComplete = false
        this._xuanwutangComplete = false
        this._shouhushouComplete = false
        this._qiangdaoComplete = false
        this._shengsijieComplete = false
        this._shenqiComplete = false
    }

    isComplete() {
        return this._zhuoguiComplete && this._zhongzuComplete && this._yunbiaoComplete && this._juqingComplete && this._fubenComplete && this._huashanComplete && this._yantadigongComplete && this._baihutangComplete && this._qinglongtangComplete && this._xuanwutangComplete && this._shouhushouComplete && this._qiangdaoComplete && this._shengsijieComplete && this._shenqiComplete
    }

    setIsComplete(v) {
        this._zhuoguiComplete = v
        this._zhongzuComplete = v
        this._yunbiaoComplete = v
        this._juqingComplete = v
        this._fubenComplete = v
        this._huashanComplete = v
        this._yantadigongComplete = v
        this._baihutangComplete = v
        this._qinglongtangComplete = v
        this._xuanwutangComplete = v
        this._shouhushouComplete = v
        this._qiangdaoComplete = v
        this._shengsijieComplete = v
        this._shenqiComplete = v
    }

    resetCompleteStatus() {
        this.setIsComplete(false)
    }

    async taskStart(taskName) {
        this.toast('找' + taskName)
        const { text, result } = await navigateTo(__PageType__)
        if (!text) {
            return false
        }else if(getPage({ text, result }) != __PageType__){
            return false
        }

        swipeVertically(true)
        swipeVertically(true)
        swipeVertically(true)
        // 45,195,706,929
        let _r = await getPageText({ x: 0, y: 195, width: 750, height: 735 })
        for (let i of range(1, 20)) {
            if (_r.text.includes(taskName)) {
                let center = this.findAndClickRect(_r, taskName)
                if (center.y > 820) {
                    swipeVertically()
                }
                break;
            }
            swipeVertically()
            if (i % 6 == 0) {
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
            if (taskName == __ZHUOGUI__) 
                this._zhuoguiComplete = true
            if (taskName == __ZHONGZU__) 
                this._zhongzuComplete = true
            if (taskName == __JUQING__) 
                this._juqingComplete = true
            if (taskName == __YUNBIAO__) 
                this._yunbiaoComplete = true
            if (taskName == __FUBEN__) 
                this._fubenComplete = true
            if (taskName == __HUASHAN__) 
                this._huashanComplete = true
            if (taskName == __YANTADIGONG__) 
                this._yantadigongComplete = true
            if (taskName == __BAIHUTANG__) 
                this._baihutangComplete = true
            if (taskName == __QINGLONGTANG__) 
                this._qinglongtangComplete = true
            if (taskName == __XUANWUTANG__) 
                this._xuanwutangComplete = true
            if (taskName == __SHOUHUSHOU__) 
                this._shouhushouComplete = true
            if (taskName == __QIANGDAO__) 
                this._qiangdaoComplete = true
            if (taskName == __SHENQI__)
                this._shenqiComplete = true
            
            return false
        }

        return false
    }

    // 捉鬼
    async zhuogui() {
        let find = await this.taskStart(__ZHUOGUI__)
        if (!find) {
            return false
        }
        // 518,1111,727,1189   前往抓鬼
        // 518,1111,727,1189   挑战
        let _r = await getPageText({ x: 520, y: 1111, width: 207, height: 78 })
        if (_r.text.includes('前往抓鬼')) {
            this.findAndClickRect(_r, '前往抓鬼')
            for (let i of range(1, 10)) {
                _r = await getPageText({ x: 520, y: 1111, width: 207, height: 78 })
                if (_r.text.includes('挑战')) {
                    this.findAndClickRect(_r, '挑战')
                    sleep(10 * 1000)
                }
            }
        }

        // 585,811,732,892  领取
        _r = await getPageText({ x: 585, y: 811, width: 147, height: 81 })
        if (_r.text.includes('领取'))
        {
            tap(655, 855)
            this.toast('钟馗捉鬼完成')
            this._zhuoguiComplete = true
        }
    }

    // 种族
    async zhongzu() {
        let find = await this.taskStart(__ZHONGZU__)
        if (!find) {
            return false
        }
        
        let _r = await getPageText({ x: 520, y: 1111, width: 207, height: 78 })
        for (let i of range(1, 20)) {
            if (_r.text.includes('我这就去')) {
                this.findAndClickRect(_r, '我这就去')
                tap(600, 1150)
                sleep(10 * 1000)
            }
        }

        // 585,811,732,892  领取
        _r = await getPageText({ x: 587, y: 878, width: 162, height: 49 })
        if (_r.text.includes('9/9'))
        {
            tap(650, 855)
            for (let _ of range(1, 9)) {
                tap(370, 1130)
            }
            tap(680, 1140)
            this.toast('种族任务完成')
            this._zhongzuComplete = true
        }
    }

    // 剧情挑战
    async juqing() {
        let find = await this.taskStart(__JUQING__)
        if (!find) {
            return false
        }

        tap(620, 300)
        tap(50, 1250)
        this.toast('剧情挑战任务完成')
        this._juqingComplete = true
    }

    // 运镖
    async yunbiao() {
        let find = await this.taskStart(__YUNBIAO__)
        if (!find) {
            return false
        }

        // 选择镖银
        tap(620, 1150)
        // 一键领取
        tap(375, 1130)
        // 一键接镖
        tap(375, 1130)
        // 返回
        tap(50, 1250)
        this.toast('运镖完成')
        this._yunbiaoComplete = true
    }

    // 副本任务
    async fuben() {
        let find = await this.taskStart(__FUBEN__)
        if (!find) {
            return false
        }

        tap(375, 1030)
        // 返回
        tap(50, 1250)
        this.toast('副本任务完成')
        this._fubenComplete = true
    }

    // 决战华山
    async huashan() {
        let find = await this.taskStart(__HUASHAN__)
        if (!find) {
            return false
        }

        tap(200, 1050)
        // 返回
        tap(50, 1250)
        this.toast('决战华山完成')
        this._huashanComplete = true
    }

    // 雁塔地宫
    async yantadigong() {
        let find = await this.taskStart(__YANTADIGONG__)
        if (!find) {
            return false
        }

        tap(200, 1050)
        // 返回
        tap(50, 1250)
        this.toast('雁塔地宫完成')
        this._yantadigongComplete = true
    }

    // 白虎堂任务
    async baihutang() {
        let find = await this.taskStart(__BAIHUTANG__)
        if (!find) {
            return false
        }

        tap(620, 1150)
        tap(590, 750)
        let _r = await getPageText()
        if (_r.text.includes('近期不再提醒')) {
            this.findAndClickRect(_r, '取消')
        }
    }


    // 青龙堂任务
    async qinglongtang() {
        let find = await this.taskStart(__QINGLONGTANG__)
        if (!find) {
            return false
        }
        tap(620, 1150)
        tap(620, 1020)
        this.toast('青龙堂任务完成')
        this._qinglongtangComplete = true
    }

    // 玄武堂任务
    async xuanwutang() {
        let find = await this.taskStart(__XUANWUTANG__)
        if (!find) {
            return false
        }
        tap(620, 1150)
        tap(210, 1060)
        tap(670, 1170)
        this.toast('玄武堂任务完成')
        this._xuanwutangComplete = true
    }

      // 帮派守护兽任务
      async shouhushou() {
        let find = await this.taskStart(__SHOUHUSHOU__)
        if (!find) {
            return false
        }

        tap(210, 1040)
        tap(210, 747)
        tap(50, 1250)
        this.toast('帮派守护兽任务完成')
        this._shouhushouComplete = true
      }
    
    // 帮派除盗
    async qiangdao() {
        let find = await this.taskStart(__QIANGDAO__)
        if (!find) {
            return false
        }

        tap(550, 920)
        tap(230, 890)
        for (let _ of range(1, 5)) {
            tap(375, 890)
            sleep(10 * 1000)
        }

        tap(50, 1250)
        this.toast('帮派除盗任务完成')
        this._qiangdaoComplete = true
    }

    // 生死劫
    async shengsijie() {
        await navigateTo(pageType.zhucheng)
        tap(600, 520)
        tap(615, 1140)
        tap(330, 1040)
        tap(50, 1250)
        this._shengsijieComplete = true
    }

    // 神器
    async shenqi() {
        let find = await this.taskStart(__SHENQI__)
        if (!find) {
            return false
        }
        tap(166, 955)
        sleep(25000)
        tap(260, 1050)
        tap(166, 955)
        sleep(25000)
        tap(50, 1250)
        this.toast('神器任务完成')
        this._shengsijieComplete = true
    }

    async trigger(name) {
        await super.trigger(name)

        if (!this._shenqiComplete) {
            await this.shenqi()
            tap(50, 1250)
        }

        if (!this._shengsijieComplete) {
            await this.shengsijie()
            tap(50, 1250)
        }
        
        if (!this._baihutangComplete) {
            await this.baihutang()
            tap(50, 1250)
        }

        if (!this._juqingComplete) {
            await this.juqing()
            tap(50, 1250)
        }

        if (!this._yunbiaoComplete) {
            await this.yunbiao()
            tap(50, 1250)
        }

        if (!this._fubenComplete) {
            await this.fuben()
            tap(50, 1250)
        }

        if (!this._huashanComplete) {
            await this.huashan()
            tap(50, 1250)
        }

        if (!this._yantadigongComplete) {
            await this.yantadigong()
            tap(50, 1250)
        }

        if (!this._qinglongtangComplete) {
            await this.qinglongtang()
            tap(50, 1250)
        }

        if (!this._xuanwutangComplete) {
            await this.xuanwutang()
            tap(50, 1250)
        }

        if (!this._shouhushouComplete) {
            await this.shouhushou()
            tap(50, 1250)
        }

        if (!this._qiangdaoComplete) {
            await this.qiangdao()
            tap(50, 1250)
        }


        if (!this._zhuoguiComplete) {
            await this.zhuogui()
            tap(50, 1250)
        }

        if (!this._zhongzuComplete) {
            await this.zhongzu()
            tap(50, 1250)
        }
        return this.generateTask()
    }
}

module.exports = {
	richangTask
}