async function getPageText(region)
{
    if (!region) {
        region = { x: 0, y: 0, width: 750, height: 1310 }
    }
	const options = {
		// OPTIONAL, area of the screen you want to detect
		region: region,

		// OPTIONAL, an array of strings to supplement the recognized languages at the word recognition stage.
		// customWords: ['Deploy', 'Troops'],

		// OPTIONAL, the minimum height of the text expected to be recognized, relative to the region/screen height, default is 1/32
		// minimumTextHeight: 1 / 32,

		// OPTIONAL, 0 means accurate first, 1 means speed first
		level: 0,

		// OPTIONAL, an array of languages to detect, in priority order, only `en-US` supported now. ISO language codes: http://www.lingoes.net/en/translator/langcode.htm
		// Use function `at.recognizeTextSupportedLanguages()` to get the supported languages
		languages: ['zh-Hans'],

		// OPTIONAL, whether use language correction during the recognition process.
		// correct: false,

		// OPTIONAL, you can choose to produce debug image
		debug: false,
	}

	/**
	 * Recognize text on the screen or a specified region
	 * at.recognizeText(options, callback)
	 * @param {object} options - recognition options
	 * @param {function} callback - callback function for handling the result or error
	 */
    const r = await new Promise((resolve, reject)=>{
        at.recognizeText(options, (result, error) => {
            if (error) {
                alert(error)
                reject()
            } else {
                // console.log(`Got result of recognizeText:\n${JSON.stringify(result, null, '    ')}`)
                // Got result of recognizeText:
                var texts = []
                result.forEach((value, i) => {
                    texts.push(value.text)
                })
                let text = String(texts)
                let r = {text, result}
                resolve(r)
            }
        })
    })

    return r
}

module.exports = {
	getPageText
}