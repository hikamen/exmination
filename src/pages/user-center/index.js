//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const User = require('../../model/user');

let pageData = {
    user: null
};

Page({
    data: pageData,
    onLoad: function () {
        this.getProfile();
    },

    getProfile: function () {
        http.get(http.URL_GET_PROFILE, {}, result => {
            let user = new User(result);
            this.setData({
                user: user
            })
        })
    },
    logoutHandle: function () {
        util.showConfirm('确定要注销登录吗？', () => {
            http.get(http.URL_LOGOUT, {}, (result) => {
                wx.clearStorageSync();
                util.redirectTo('/pages/login/index');
            })
        })
    }

});
