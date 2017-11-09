//index.js
const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');

Page({
    data: {
        focusName: true,
        warningMsg: '',
        nameError: false,
        passwordError: false,
        submitDisabled: false,
        submitLoading: false
    },
    onLoad: function () {
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
        util.navigateTo('/pages/register/index');
    },

    nameConfirm: function (event) {
        if (this._validUsername(event.detail.value)) {
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
        let warningMsg = '';
        if (util.trim(value) === '') {
            warningMsg = '密码不能为空';
            valid = false;
        }
        this.setData({
            passwordError: !valid,
            warningMsg: warningMsg
        });
        if (warningMsg !== '') {
            setTimeout(() => {
                this.setData({
                    warningMsg: ''
                });
            }, 3000);
        }
        return valid;
    },
    _validUsername: function (value) {
        let valid = true;
        let warningMsg = '';
        if (util.trim(value) === '') {
            warningMsg = '手机号不能为空';
            valid = false;
        }
        this.setData({
            nameError: !valid,
            warningMsg: warningMsg
        });
        if (warningMsg !== '') {
            setTimeout(() => {
                this.setData({
                    warningMsg: ''
                });
            }, 3000);
        }
        return valid;
    }
});
