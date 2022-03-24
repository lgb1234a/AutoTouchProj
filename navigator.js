const { getPageText } = require('./ocr')
const { getPage, pages, pageType } = require('./pages')
const { tap } = require('./tap')
const { findAndClickRect, getRectCenter } = require('./rect')
const { sleep } = require('./sleep')

async function navigateTo(destPageType) {
    var crtPageType
    var r
    let loopsCount = 0
    while(crtPageType != destPageType) {
        r = await getPageText()
        if (r) {
            crtPageType = getPage(r)
            if (crtPageType == destPageType) {
                break;
            }
            // console.log(crtPageType + '   ' + destPageType)
            switch (crtPageType) {
                case pageType.denglu:
                    // 登录, 点登陆按钮
                    // console.log('登录')
                    tap(370, 860)
                    break;
                case pageType.zhucheng:
                    // console.log('主城')
                    if (destPageType == pageType.wanfa || destPageType == pageType.guaji) {
                        tap(50, 1250)
                    } else {
                        tap(600, 1000)
                    }
                    break;
                case pageType.guaji:
                    // console.log('挂机')
                    if (destPageType == pageType.wanfa || destPageType == pageType.guaji) {
                        tap(40, 540)
                    } else {
                        tap(180, 1280)
                    }
                    break;
                case pageType.juqing:
                    // console.log('剧情挑战')
                case pageType.fengyao:
                    // console.log('封妖')
                    if (destPageType == pageType.disha) {
                        findAndClickRect(r, '地煞星')
                        r = await getPageText()
                    }else if (destPageType == pageType.chenxing) {
                        findAndClickRect(r, '天降')
                        r = await getPageText()
                    }else if (destPageType == pageType.yaowang) {
                        findAndClickRect(r, '封印妖王')
                        r = await getPageText()
                    } else {
                        tap(180, 1280)
                    }
                    break
                case pageType.disha:
                    // console.log('地煞')
                    if (destPageType != pageType.disha) {
                        tap(180, 1280)
                    }
                    break
                case pageType.chenxing:
                    // console.log('辰星')
                    if (destPageType != pageType.chenxing) {
                        tap(180, 1280)
                    }
                    break
                case pageType.yaowang:
                    if (destPageType != pageType.yaowang) {
                        tap(180, 1280)
                    }
                    break
                case pageType.lixianshouyi:
                    // alert('离线收益')
                    tap(180, 1280)
                    break
                case pageType.duanxianchonglian:
                    // alert('短线重连')
                    break
                case pageType.dinghaodenglu:
                case pageType.lianjieshibai:
                case pageType.denglushibai:
                    // alert('登录认证失败')
                    tap(380, 750)
                    break
                case pageType.huodong:
                    // 每日活动首页
                    findAndClickRect(r, '关闭')
                    r = await getPageText()
                    break
                default:
                    // 未识别, 点击主城按钮
                    // alert(crtPageType)
                    tap(180, 1280)
                    break
            }
        }
        loopsCount ++
        if (loopsCount > 10) {
            loopsCount = 0
            // 截屏
            at.screenshot(`ScreenShot/${new Date().toISOString()}.png`)
            console.log('找不到目标页面，重启')
            at.appKill("com.netease.mhxywyb")
            sleep(5000)
            at.appRun("com.netease.mhxywyb")
            sleep(5000)
        }
    }
    return r
}

module.exports = {
    navigateTo
}