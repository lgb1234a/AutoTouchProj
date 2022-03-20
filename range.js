
function range(idx, to) {
    let _range = {
        from: idx,
        to: to,
        
        [Symbol.iterator]() {
            this.current = this.from;
            return this;
        },
        
        next() {
            const state = at.appState("com.netease.mhxywyb")
            if (state != 'ACTIVATED') {
                return { done: true }
            }

            if (this.current <= this.to) {
                return { done: false, value: this.current++ }
            } else {
                return { done: true }
            }
        }
    }
    return _range
}

// for (let num of range) {
//     console.log(num)
// }

module.exports = {
    range
}