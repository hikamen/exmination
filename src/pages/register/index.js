//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const Department = require('../../model/department');
const Position = require('../../model/position');

let pageData = {
    mobileError: false,
    fullnameError: false,
    idCardError: false,
    companyError: false,
    departmentError: false,
    passwordError: false,
    confirmPwdError: false,

    warningMsg: '',
    deptIndex: -1,
    pstIndex: 0,
    departments: [],
    positions: []
};

Page({
    data: pageData,
    onLoad: function (option) {
        this._getDepartments();
    },

    _getDepartments: function () {
        http.get(http.URL_GET_DEPARTMENTS, {}, result => {
            if (result && result.length > 0) {
                let departments = [];
                let deptIndex = -1;
                for (let i = 0; i < result.length; i++) {
                    let dept = new Department(result[i]);
                    departments.push(dept);
                    if (dept.defaultInd) {
                        deptIndex = i;
                    }
                }
                this.setData({
                    deptIndex: deptIndex,
                    departments: departments
                });
            }
            this._getPositions();
        })
    },

    _getPositions: function () {
        http.get(http.URL_GET_POSITIONS, {}, result => {
            if (result && result.length > 0) {
                let positions = [];
                let pstIndex = -1;
                for (let i = 0; i < result.length; i++) {
                    let post = new Position(result[i]);
                    positions.push(post);
                    if (post.defaultInd) {
                        pstIndex = i;
                    }
                }
                this.setData({
                    pstIndex: pstIndex,
                    positions: positions
                });
            }
        });
    },
    formSubmit: function (event) {
        console.log(event);
        let user = event.detail.value;

        if(this._validate(user)) {
            user.departmentId = this.data.departments[user.deptIndex].id;
            user.positionId = this.data.positions[user.pstIndex].id;
            http.post(http.URL_REGISTER, user, ()=> {
                util.showAlert('您已经成功注册，请耐心等候管理员通过审核，只有审核通过才能登录', ()=>{
                    wx.navigateBack('/pages/login/index');
                });
            });
        }

    },

    _validate: function (user) {
        let mobileError = false;
        if (util.trim(user.mobile) === '') {
            mobileError = true;
        }
        let fullnameError = false;
        if (util.trim(user.fullname) === '') {
            fullnameError = true;
        }
        let idCardError = false;
        if (util.trim(user.idCard) === '') {
            idCardError = true;
        }
        let companyError = false;
        if (util.trim(user.company) === '') {
            companyError = true;
        }
        let departmentError = false;
        if (this.data.deptIndex === -1) {
            departmentError = true;
        }
        let passwordError = false;
        if (util.trim(user.password) === '') {
            passwordError = true;
        }
        let confirmPwdError = false;
        if (util.trim(user.confirmPwd) === '') {
            confirmPwdError = true;
        }

        let warningMsg = '';
        if (user.password && user.confirmPwd && user.password !== user.confirmPwd) {
            confirmPwdError = true;
            warningMsg = '两次密码输入不一致';
        } else {
            let pwdReg = new RegExp("^[A-Za-z0-9]{6,30}$");
            if (user.password && !pwdReg.test(user.password)) {
                passwordError = true;
                warningMsg = '密码只支持英文大小写字母和数字，长度介于6和30位之间';
            }
        }

        this.setData({
            mobileError: mobileError,
            fullnameError: fullnameError,
            idCardError: idCardError,
            companyError: companyError,
            departmentError: departmentError,
            passwordError: passwordError,
            confirmPwdError: confirmPwdError,
            warningMsg: warningMsg
        });
        if (warningMsg !== '') {
            setTimeout(() => {
                this.setData({
                    warningMsg: ''
                });
            }, 3000);
        }
        return !mobileError && !fullnameError && !idCardError && !companyError
            && !departmentError && !passwordError && !confirmPwdError
    },
    departmentChange: function (event) {
        this.setData({
            deptIndex: parseInt(event.detail.value)
        })
    },
    positionChange: function (event) {
        this.setData({
            pstIndex: parseInt(event.detail.value)
        })
    },
    goBack: function () {
        wx.navigateBack();
    }
});
