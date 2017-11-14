//app.js
const util = require('./utils/util');
const http = require('./utils/http');
const constants = require('./utils/constants');

App({
    globalData: {
        scene: -1,
        path: '',
        activityId: ''
    },
    onLaunch: function (option) {
        console.log('onLaunch', option);
        this.globalData.scene = decodeURIComponent(option.scene);
        this.globalData.path = decodeURIComponent(option.path);
        if (option.query) {
            this.globalData.activityId = decodeURIComponent(option.query.activityId);
        }
        this._login();
    },
    onShow: function (option) {
        console.log('onShow', option);
    },
    _login: function () {
        let token = wx.getStorageSync(constants.TOKEN);
        if (token === undefined  || token === '') {
            wx.reLaunch({
                url: '/pages/login/index'
            });
        }
    }
})
