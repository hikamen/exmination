//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const que_model = require('../../model/question');

Page({
    data: {
        activityId: '',
        resourceId: '',
        enrollmentId: '',
        title: '',

        paperRecords: [],
        noDataLabel: '',
    },
    onLoad: function (option) {
        this.data.activityId = option.activityId;
        this.data.resourceId = option.resourceId;
        this.data.enrollmentId = option.enrollmentId;
        this.data.title = option.title;

        this._getRemoteData();
    },
    onPullDownRefresh: function () {
        this._getRemoteData();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, constants.PULL_DOWN_STOP_TIME);
    },
    _getRemoteData() {
        let params = {
            activityId: this.data.activityId,
            resourceId: this.data.resourceId,
            enrollmentId: this.data.enrollmentId
        };
        http.get(http.URL_FIND_ATTENDANCE_HISTORY, params, result => {
            let paperRecords = [];
            if (result.paperRecordList && result.paperRecordList.length > 0) {
                for (let item of result.paperRecordList) {
                    let record = new que_model.PaperRecord(item);
                    paperRecords.push(record);
                }
            }
            this.setData({
                paperRecords: paperRecords,
                noDataLabel: constants.NO_MORE_DATA_LABEL
            });

        });
    },
    goViewResult(event) {
        let url = '/pages/exam-result/index?resourceId=' + this.data.resourceId
            + '&activityEnrollmentId=' + this.data.enrollmentId +
            '&learningSessionId=' + event.currentTarget.dataset.sessionId + '&activityId=' + this.data.activityId
            + '&title=' + this.data.title;
        util.navigateTo(url);
    },
    goViewRanking(event) {

    }
});
