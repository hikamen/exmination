//index.js
const app = getApp();
let util = require('../../utils/util');
let http = require('../../utils/http')

Page({
    data: {
        focus: true,
        errMsg: '',
        submitDisabled: false,
        submitLoading: false
    },
    onLoad: function () {
        console.log('login');
    },
    formSubmit: function (event) {
        if(this._validUsername(event.detail.value.username)
            && this._validPassword(event.detail.value.password)) {
            this.setData({
                submitDisabled: true,
                submitLoading: true
            });
            http.post(http.URL_LOGIN, event.detail.value, data => {
                util.redirectTo('/pages/home/index');
            }, ()=> {
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
        this._validUsername(event.detail.value);
    },
    nameBlur: function (event) {
        this._validUsername(event.detail.value);
    },
    passwordConfirm: function (event) {
        this._validPassword(event.detail.value);
    },
    passwordBlur: function (event) {
        this._validPassword(event.detail.value);
    },
    _validPassword: function (value) {
        let valid = false;
        if (util.trim(value) === '') {
            this.setData({
                errMsg: '密码不能为空'
            });
        } else {
            this.setData({
                errMsg: ''
            });
            valid = true;
        }
        return valid;
    },
    _validUsername: function (value) {
        let valid = false;
        if (util.trim(value) === '') {
            this.setData({
                errMsg: '用户名不能为空'
            });
        } else {
            this.setData({
                focus: false,
                errMsg: ''
            });
            valid = true;
        }
        return valid;
    }
});
