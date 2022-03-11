const { sleep } = require('./sleep')
const { getPageText } = require('./ocr')
const { getPage, pages, pageType } = require('./pages')
const { AbstractTask } = require('./AbstractTask')
const { navigateTo } = require('./navigator')
const { tap } = require('./tap')

const __PageType__ = pageType.disha
class dishaTask extends AbstractTask {

    constructor(gtCallback) {
        super(gtCallback)
        // 屡水吐焰：5x  摄魂追魄：6x  御风神行：4x
    }
    
    async trigger(name) {
        await super.trigger(name)
        const { text, result } = await navigateTo(__PageType__)
        if (!text) {
            console.log(1)
            return this.generateTask()
        }else if(getPage({ text, result }) != __PageType__){
            console.log(2)
            return this.generateTask()
        }
        
        // 在地煞页等到30分
        let now = new Date()
        let mintue = now.getMinutes()
        while(mintue == 29) {
            sleep(1000)
            now = new Date()
            mintue = now.getMinutes()
        }

        console.log(3)
        // 挑战
        tap(620, 820)
        sleep(1000)
        
        let _r = await getPageText({ x: 0, y: 200, width: 750, height: 900 })
        if (getPage(_r) != pageType.guaji) {
            if (_r.text.includes('挑战')) {
                // 点击挑战
                var _find
                _r.result.forEach((v, i)=>{
                    if (v.text == '挑战') {
                        _find = v
                    }
                })
                console.log(_find)
                if (_find) {
                    const {x, y} = this.getRectCenter(_find.rectangle)
                    tap(x, y)
                    console.log(x + '  ' + y)
                }
            }
        }

        this.setIsComplete(true)
        sleep(40000)
        this.toast('地煞完成')
        return this.generateTask()
    }
}

module.exports = {
    dishaTask
}