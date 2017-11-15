//app.js
const util = require('./utils/util');
const http = require('./utils/http');
const constants = require('./utils/constants');

App({
    globalData: {
        scene: '',
        path: '',
        activityId: ''
    },
    onLaunch: function (option) {
        console.log('onLaunch', option);
        this.globalData.scene = decodeURIComponent(option.scene) + '';
        this.globalData.path = decodeURIComponent(option.path);
        if (option.query) {
            this.globalData.activityId = decodeURIComponent(option.query.scene);
        }
        this._login();
    },
    onShow: function (option) {
        console.log('onShow', option);
    },
    isUserLogin: function () {
        let token = wx.getStorageSync(constants.TOKEN);
        return !(token === undefined  || token === '');
    },
    clearPath: function () {
        this.globalData.path = '';
    },
    _login: function () {
        if (!this.isUserLogin()) {
            wx.reLaunch({
                url: '/pages/login/index'
            });
        }
    }
})
