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

function formatDatetime(value) {
    value = trim(value);
    if(value != '') {
        value = value.substring(0, 16);
    }
    return value;
}

function trim(s) {
    if (s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    } else {
        return "";
    }
}

function showToast(title, success) {
    wx.showToast({
        title: title,
        icon: 'success',
        duration: 3000,
        success: success
    })
}

function showAlert(content, callback) {
    wx.showModal({
        title: '提示',
        content: content,
        showCancel: false,
        success: () => {
            if (typeof callback === 'function') {
                callback();
            }
        }
    });
}

function showConfirm(content, yesCallback, noCallback) {
    wx.showModal({
        title: '确认',
        content: content,
        success: res => {
            if (res.confirm && typeof yesCallback === 'function') {
                yesCallback();
            } else if (typeof  noCallback === 'function') {
                noCallback();
            }
        },
    });
}

function showLoading(title) {
    title = title || '加载中...';
    wx.showLoading({
        title: title,
        mask: true
    });
}

function redirectTo(url, success) {
    wx.redirectTo({
        url: url,
        success: success
    })
}

module.exports = {
    formatTime: formatTime,
    formatDatetime: formatDatetime,
    showToast: showToast,
    showAlert: showAlert,
    showConfirm: showConfirm,
    showLoading: showLoading,
    trim: trim,
    redirectTo: redirectTo
}
