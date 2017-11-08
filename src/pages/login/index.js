//index.js
const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');

Page({
    data: {
        focusName: true,
        errMsg: '',
        submitDisabled: false,
        submitLoading: false
    },
    onLoad: function () {
        console.log('login');
    },
    formSubmit: function (event) {
        if (this._validUsername(event.detail.value.username)
            && this._validPassword(event.detail.value.password)) {
            this.setData({
                submitDisabled: true,
                submitLoading: true
            });
            http.post(http.URL_LOGIN, event.detail.value, data => {
                wx.setStorageSync(constants.TOKEN, data.token);
                wx.reLaunch({
                    url: '/pages/exam-center/index'
                });
            }, () => {
                this.setData({
                    submitDisabled: false,
                    submitLoading: false
                });
            });
        }
    },

    goToRegistration: function () {
        console.log('registration');
    },

    nameConfirm: function (event) {
        if(this._validUsername(event.detail.value)) {
            this.setData({
                focusName: false
            });
        }
    },
    nameBlur: function (event) {
        this._validUsername(event.detail.value);
    },
    /*nameFocus: function () {
        this.setData({
            focusName: true,
            focusPassword: false
        });
    },*/
    passwordConfirm: function (event) {
        this._validPassword(event.detail.value);
    },
    passwordBlur: function (event) {
        this._validPassword(event.detail.value);
    },
    _validPassword: function (value) {
        let valid = true;
        if (util.trim(value) === '') {
            this.setData({
                errMsg: '密码不能为空'
            });
            valid = false;
        } else {
            this.setData({
                errMsg: ''
            });
        }
        return valid;
    },
    _validUsername: function (value) {
        let valid = true;
        if (util.trim(value) === '') {
            this.setData({
                errMsg: '用户名不能为空'
            });
            valid = false;
        } else {
            this.setData({
                errMsg: ''
            });
        }
        return valid;
    }
});
