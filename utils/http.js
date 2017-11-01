let util = require('util');

const CODE_SUCCESS = 1;
const CODE_ERROR = 0;
const CODE_TOKEN_EXPIRE = -1;

function doAfterRequestSuccess(res, callback) {
    // console.log('success', res);
    if (res.statusCode == 200) {
        let apiResponse = res.data;
        console.log(apiResponse);
        switch (apiResponse.code) {
            case CODE_ERROR: {
                let message = apiResponse.message || '服务器处理请求出现错误';
                util.showAlert(message);
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
            default: {
                if (typeof callback == 'function') {
                    callback(apiResponse.data);
                }
            }
        }
    } else {
        util.showAlert('请求遇到错误，状态码：' + res.statusCode);
    }
}

function doAfterRequestFail(err) {
    console.log(err);
    util.showAlert('请求遇到网络错误，请稍后重试');
}

function get(url, data, callback) {
    wx.request({
        url: url,
        data: data,
        method: 'GET',
        success: res => {
            doAfterRequestSuccess(res, callback);
        },
        fail: err => {
            doAfterRequestFail(err);
        }
    });
}

function post(url, data, callback) {
    wx.request({
        url: url,
        data: data,
        method: 'POST',
        header: 'application/x-www-form-urlencoded',
        success: res => {
            doAfterRequestSuccess(res, callback);
        },
        fail: err => {
            doAfterRequestFail(err);
        }
    });
}

const SERVER_NAME = 'http://localhost:8780/sunlearning';
module.exports = {
    get: get,
    post: post,
    URL_LOGIN: SERVER_NAME + '/api/login',
    URL_REGISTER: SERVER_NAME + '/api/register',

};
