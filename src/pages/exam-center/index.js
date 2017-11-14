//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const model = require('../../model/activity');


const EXAM_CENTER_INDEX = 0;
const MY_EXAM_INDEX = 1;
let sliderWidth = 90; // 需要设置slider的宽度，用于计算中间位置


let pageData = {
    tabs: ["考试列表", "我的考试"],
    activeIndex: EXAM_CENTER_INDEX,
    sliderOffset: 0,
    sliderLeft: 0,

    noDataLabel: '',
    page: 1,
    limit: constants.LIMIT,
    examList: [],

    noDataLabel2: '',
    page2: 1,
    limit2: constants.LIMIT,
    examList2: [],
    init2: false
};

Page({
    data: pageData,
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: parseInt(e.currentTarget.id)
        });

        if (this.data.activeIndex === MY_EXAM_INDEX && !this.data.init2) {
            this.data.init2 = true;
            this._getMyExamData();
        }
    },
    /**
     * 在onReady时去获取后台数据，而不在onLoad时获取，
     * 避免Token无效时需要跳转到登录页面时出现的问题
     */
    onReady: function () {
        let scene = app.globalData.scene;
        let path = app.globalData.path;
        let activityId = app.globalData.activityId;

        if ((scene === 1047 || scene === 1048) && path === 'pages/exam-detail/index') {
            util.navigateTo("/pages/exam-detail/index?id=" + activityId);
        }
        this._getExamCenterData();
    },
    onPullDownRefresh: function () {
        if (this.data.activeIndex === EXAM_CENTER_INDEX) {
            this.setData({
                examList: [],
                page: 1,
                noDataLabel: ''
            });
            this._getExamCenterData();
        } else {
            this.setData({
                examList2: [],
                page2: 1,
                noDataLabel2: ''
            });
            this._getMyExamData();
        }
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, constants.PULL_DOWN_STOP_TIME);
    },
    onReachBottom: function () {
        if (this.data.activeIndex === EXAM_CENTER_INDEX) {
            this.setData({
                page: this.data.page + 1
            });
            this._getExamCenterData();
        } else {
            this.setData({
                page2: this.data.page2 + 1
            });
            this._getMyExamData();
        }

    },
    _getExamCenterData: function () {
        this._getRemoteData(this.data.page, this.data.limit, http.URL_EVALUATION_LIST,
            this.data.examList, (label, list) => {
                list = list || this.data.examList;
                this.setData({
                    noDataLabel: label,
                    examList: list
                });
            });
    },
    _getMyExamData: function () {
        this._getRemoteData(this.data.page2, this.data.limit2, http.URL_MY_EVALUATION_LIST,
            this.data.examList2, (label, list) => {
                list = list || this.data.examList2;
                this.setData({
                    noDataLabel2: label,
                    examList2: list
                });
            });
    },
    _getRemoteData: function (page, limit, url, list, callback) {
        let params = {
            page: page,
            limit: limit
        };
        http.get(url, params, result => {
            if (result.numberOfElements > 0) {
                for (let item of result.content) {
                    let exam = new model.Activity(item);
                    if (item.extra && item.extra.attendance) {
                        exam.attendance = new model.ActivityAttendance(item.extra.attendance);
                    }
                    list.push(exam);
                }
                let label = '';
                if (result.last) {
                    label = constants.NO_MORE_DATA_LABEL;
                }
                callback(label, list);
            } else {
                let label = constants.NO_DATA_LABEL;
                if (list.length > 0) {
                    label = constants.NO_MORE_DATA_LABEL;
                }
                callback(label);
            }
        })
    }
});
