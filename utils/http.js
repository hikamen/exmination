let util = require('util');

const CODE_SUCCESS = 1;
const CODE_ERROR = 0;
const CODE_TOKEN_EXPIRE = -1;

function doAfterRequestSuccess(res, callback, errCallback) {
    // console.log('success', res);
    if (res.statusCode == 200) {
        let apiResponse = res.data;
        console.log(apiResponse);
        switch (apiResponse.code) {
            case CODE_ERROR: {
                let message = apiResponse.message || '服务器处理请求出现错误';
                util.showAlert(message, errCallback);
                break;
            }
            case CODE_TOKEN_EXPIRE: {
                utils.showAlert('会话已过期，需要重新登录', () => {
                    wx.redirectTo({
                        url: '/pages/login/index'
                    })
                });
                break;
            }
            case CODE_SUCCESS: {
                if (typeof callback == 'function') {
                    callback(apiResponse.data);
                }
                break;
            }
        }
    } else {
        util.showAlert('请求遇到错误，状态码：' + res.statusCode, errCallback);
    }
}

function doAfterRequestFail(err, errCallback) {
    console.log(err);
    util.showAlert('请求遇到网络错误，请稍后重试', errCallback);
}

function get(url, data, callback, errCallback) {
    wx.request({
        url: url,
        data: data,
        method: 'GET',
        success: res => {
            doAfterRequestSuccess(res, callback, errCallback);
        },
        fail: err => {
            doAfterRequestFail(err, errCallback);
        }
    });
}

function post(url, data, callback, errCallback) {
    wx.request({
        url: url,
        data: data,
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: res => {
            doAfterRequestSuccess(res, callback, errCallback);
        },
        fail: err => {
            doAfterRequestFail(err, errCallback);
        }
    });
}

const SERVER_NAME = 'http://192.168.2.116:8780/sunlearning';
module.exports = {
    get: get,
    post: post,
    URL_LOGIN: SERVER_NAME + '/api/login',
    URL_REGISTER: SERVER_NAME + '/api/register',

};
