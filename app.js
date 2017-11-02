//app.js
const util = require('./utils/util');
const http = require('./utils/http');
const constants = require('./utils/constants');

App({
    onLaunch: function () {
        let token = wx.getStorageSync(constants.TOKEN);
        if (token == null || token == '') {
            wx.reLaunch({
                url: '/pages/login/index'
            })
        }
    },
    globalData: {
        userInfo: null
    }
})
