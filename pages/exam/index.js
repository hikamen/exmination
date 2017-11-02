//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');

class Exam {
    id = '';
    title = '';
    enrollStartDatetime = '';
    enrollEndDatetime = '';
    enrollDatetime = '';

    constructor(id, title, enrollStartDatetime, enrollEndDatetime) {
        this.id = id;
        this.title = title;
        this.enrollStartDatetime = util.formatDatetime(enrollStartDatetime);
        this.enrollEndDatetime = util.formatDatetime(enrollEndDatetime);

        if (this.enrollStartDatetime === '' && this.enrollEndDatetime === '') {
            this.enrollDatetime = '不限';
        } else if (this.enrollStartDatetime === '') {
            this.enrollDatetime = '不限 至 ' + this.enrollEndDatetime;
        } else if (this.enrollEndDatetime === '') {
            this.enrollDatetime = this.enrollStartDatetime + ' 至 不限';
        } else {
            this.enrollDatetime = this.enrollStartDatetime + ' 至 ' + this.enrollEndDatetime;
        }
    }
}

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
            page: 1
        });
        this.getRemoteData();
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
                    let exam = new Exam(item.id, item.title, item.enrollStartDatetime, item.enrollEndDatetime);
                    examList.push(exam);
                }
                let label =  '';
                if(data.last) {
                    label = constants.NO_MORE_DATA_LABEL;
                }
                this.setData({
                    noDataLabel: label,
                    examList: examList
                });
            } else {
                let label =  constants.NO_DATA_LABEL;
                if(this.data.examList.length > 0) {
                    label = constants.NO_MORE_DATA_LABEL;
                }
                this.setData({
                    noDataLabel: label
                });
            }
        })
    },

});
