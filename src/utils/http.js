const util = require('util');
const constants = require('constants');

// const SERVER_NAME = 'http://192.168.2.116:8780/sunlearning';
const SERVER_NAME = 'https://szsafety.sun-learning.com';
const EXCLUDE_PAGES = ['pages/login/index', 'pages/register/index']; //包含的页面中的请求不需要登录验证

const CODE_SUCCESS = 1;
const CODE_ERROR = 0;
const CODE_TOKEN_EXPIRE = -1;

let token = '';
let permitted = false;

function doAfterRequestSuccess(res, callback, errCallback) {
    console.log(res);
    if (res.statusCode === 200) {
        let apiResponse = res.data;
        switch (apiResponse.code) {
            case CODE_ERROR: {
                let message = apiResponse.message || '服务器处理请求出现错误';
                util.showAlert(message, errCallback);
                break;
            }
            case CODE_TOKEN_EXPIRE: {
                utils.showAlert('会话已过期，需要重新登录', () => {
                    token = '';
                    wx.setStorage({
                        key: constants.TOKEN,
                        data: ""
                    });
                    wx.redirectTo({
                        url: '/pages/login/index'
                    })
                });
                break;
            }
            case CODE_SUCCESS: {
                if (typeof callback === 'function') {
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

function get(url, params, callback, errCallback) {
    _initToken();
    if (permitted) {
        util.showLoading();
        wx.request({
            url: SERVER_NAME + url,
            data: params,
            method: 'GET',
            header: {
                'X-AUTH-TOKEN': token
            },
            success: res => {
                wx.hideLoading();
                doAfterRequestSuccess(res, callback, errCallback);
            },
            fail: err => {
                wx.hideLoading();
                doAfterRequestFail(err, errCallback);
            }
        });
    }
}

function post(url, params, callback, errCallback) {
    _initToken();
    if (permitted) {
        util.showLoading('处理中...');
        wx.request({
            url: SERVER_NAME + url,
            data: params,
            method: 'POST',
            header: {
                'X-AUTH-TOKEN': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: res => {
                wx.hideLoading();
                doAfterRequestSuccess(res, callback, errCallback);
            },
            fail: err => {
                wx.hideLoading();
                doAfterRequestFail(err, errCallback);
            }
        });
    }
}


function _initToken() {
    if (token == null || token == '') {
        let value = wx.getStorageSync(constants.TOKEN);
        if (value) {
            token = 'bearer ' + value;
            permitted = true;
        } else {
            let pages = getCurrentPages();
            let route = pages[pages.length-1].route;
            permitted = false;
            for (let exPage of EXCLUDE_PAGES) {
                if (route === exPage) {
                    permitted = true;
                    break;
                }
            }
            if (!permitted) {
                util.redirectTo('/pages/login/index');
            }
        }
    }
}

function clearToken() {
    token = '';
}

module.exports = {
    get: get,
    post: post,
    clearToken: clearToken,
    SERVER_NAME: SERVER_NAME,
    URL_LOGIN: '/api/login',
    URL_LOGOUT: '/api/logout',
    URL_REGISTER: '/api/user/register',
    URL_GET_PROFILE: '/api/user/userInfo',
    URL_GET_DEPARTMENTS: '/api/department/get-data',
    URL_GET_POSITIONS: '/api/position/get-data',
    URL_EVALUATION_LIST: '/api/activity/evaluation-list',
    URL_MY_EVALUATION_LIST: '/api/activity/my-exam-list',
    URL_EVALUATION_DETAIL: '/api/activity/activity-detail',
    URL_ENROLL: '/api/activity-enrollment/enroll',
    URL_OPEN_PAPER: '/api/activity-resource/open/',
    URL_GET_PAPER_DATA: '/api/paper/get-data',
    URL_SUBMIT_PAPER: '/api/activity-resource/submit/',
    URL_GET_ANSWER_DATA: '/api/paper/get-answer-data',
    URL_FIND_ATTENDANCE_HISTORY: '/api/activity-attendance/find-attendance-history',
    URL_FIND_USER_RANKING: '/api/activity-attendance/find-user-ranking',
    URL_FIND_RANKING_LIST: '/api/activity-attendance/find-ranking-list',
    URL_TRAINGING_LIST: '/api/activity/training-list',
    URL_MY_TRAINGING_LIST: '/api/activity/my-training-list',
};
