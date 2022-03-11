
const { sleep } = require('./sleep')
const { getPageText } = require('./ocr')
const { getPage, pages, pageType } = require('./pages')
const { AbstractTask } = require('./AbstractTask') 

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
    
    async trigger(name, chenxingName) {
        await super.trigger(name)
        const { text, result } = await navigateTo(__PageType__)
        if (!text) {
            return this.generateTask()
        }else if(getPage({ text, result }) != __PageType__){
            return this.generateTask()
        }

        if (chenxingName == 'zhu') {
            // 点击300级

        }else if (chenxingName == 'gou') {
            // 点击290级
            
        }
        

        return this.generateTask()
    }
}

module.exports = {
    chenxingTask
}