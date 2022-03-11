
const pageType = {
    denglu: 1,
    zhucheng: 2,
    guaji: 3,
    fengyao: 4,
    disha: 5,
    chenxing: 6,
    yaowang: 7,
    lixianshouyi: 8,
    duanxianchonglian: 9,
    lianjieshibai: 10,
    denglushibai: 11,
    juqing: 12,
    dinghaodenglu: 13
}

const pages = [
	{
		'page': '基础收益',
		'btn': '领取',
		'type': pageType.lixianshouyi
	},
	{
		'page': '断线重连',
		'type': pageType.duanxianchonglian
	},
	{
		'page': '连接失败',
		'type': pageType.lianjieshibai
	},
    {
        'page': '登录认证失败',
        'type': pageType.denglushibai
    },
    {
        'page': '别处登录',
        'type': pageType.dinghaodenglu
    },

	
	{
		'page': '登录',
		'type': pageType.denglu
	},
	{
		// '主城': 
		'page': '神兽乐园',
		'type': pageType.zhucheng
	},
	{
		// '挂机': 
		'page': '自动挑战',
		// 'richang': '日常',
		'type': pageType.guaji
	},
	{
		// '封妖': 
		'page': '妖怪刷新提醒',
		'type': pageType.fengyao
	},
	{
		// '地煞': 
		'page': '归属者',
		'type': pageType.disha
	},
	{
		// '辰星': 
		'page': '归属次数',
		'type': pageType.chenxing
	},
    {
        // 妖王
        'page': '镇妖玉',
		'type': pageType.yaowang
    },
    {
        // 剧情挑战
        'page': '挑战剧情',
		'type': pageType.juqing
    }
	
]

function getPage(r)
{
	let text = r.text
	for (let p of pages) {
		let i = text.indexOf(p.page)
		if (i != -1 ) {
			return p.type
		}
	}
    return 0
}


module.exports = {
	getPage,
	pages,
    pageType
}