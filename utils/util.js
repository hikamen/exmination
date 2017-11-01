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

function showAlert(content, callback) {
    wx.showModal({
        title: '提示',
        content: content+'',
        showCancel: false,
        success: () => {
            if (typeof callback == 'function') {
                callback();
            }
        }
    });
}

function showConfirm(content, yesCallback, noCallback) {
    wx.showModal({
        title: '确认',
        content: content+'',
        success: res => {
            if(res.confirm && typeof yesCallback == 'function') {
                yesCallback();
            } else if(typeof  noCallback == 'function') {
                noCallback();
            }
        },
    });
}

module.exports = {
    formatTime: formatTime,
    showAlert: showAlert,
    showConfirm: showConfirm
}
