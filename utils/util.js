const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 简洁的提示窗口
const toust = (title) => {
    wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
    })
}

module.exports = {
    formatTime: formatTime,
    toust: toust
}