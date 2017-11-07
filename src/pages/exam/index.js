//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const model = require('../../model/activity');

Page({
    data: {
        noDataLabel: '',
        page: 1,
        limit: constants.LIMIT,
        examList: []
    },
    onReady: function () {
        this.getRemoteData();
    },
    onPullDownRefresh: function () {
        this.setData({
            examList: [],
            page: 1,
            noDataLabel: ''
        });
        this.getRemoteData();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, constants.PULL_DOWN_STOP_TIME);
    },
    onReachBottom: function () {
        this.setData({
            page: this.data.page + 1
        });
        this.getRemoteData();
    },
    getRemoteData: function () {
        let params = {
            page: this.data.page,
            limit: this.data.limit
        };
        http.get(http.URL_EVALUATION_LIST, params, data => {
            if (data.numberOfElements > 0) {
                let examList = this.data.examList;
                for (let item of data.content) {
                    let exam = new model.Activity(item);
                    examList.push(exam);
                }
                let label = '';
                if (data.last) {
                    label = constants.NO_MORE_DATA_LABEL;
                }
                this.setData({
                    noDataLabel: label,
                    examList: examList
                });
            } else {
                let label = constants.NO_DATA_LABEL;
                if (this.data.examList.length > 0) {
                    label = constants.NO_MORE_DATA_LABEL;
                }
                this.setData({
                    noDataLabel: label
                });
            }
        })
    }

});
