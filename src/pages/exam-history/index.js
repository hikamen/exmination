//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const que_model = require('../../model/question');
const act_model = require('../../model/activity');
const wxCharts = require('../../libs/wx-charts/wxcharts-min');

Page({
    data: {
        activityId: '',
        resourceId: '',
        enrollmentId: '',
        title: '',

        paperRecords: [],
        noDataLabel: '',
        scorePolicy: ''
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
            let scorePolicy = '', noDataLabel = constants.NO_DATA_LABEL;
            if (result.paperRecordList && result.paperRecordList.length > 0) {
                for (let item of result.paperRecordList) {
                    let record = new que_model.PaperRecord(item);
                    paperRecords.push(record);
                }
                let resAttendance = new act_model.ResourceAttendance(result);
                let resource = new act_model.Resource(result.resource);
                scorePolicy = this._getScorePolicy(resource.paperScorePolicy);
                this._buildChart(resource, resAttendance);
                noDataLabel = constants.NO_MORE_DATA_LABEL;
            }
            this.setData({
                scorePolicy: scorePolicy,
                paperRecords: paperRecords,
                noDataLabel: noDataLabel
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
        util.navigateTo('/pages/exam-ranking/index?activityId=' + this.data.activityId);
    },

    _buildChart: function (resource, resAttendance) {
        let score = resAttendance.finalScore;
        let scoreText = '评分中', scoreColor = '#d6d6d6', right = 0, subTitle = '--';
        if (score != null) {
            if (resAttendance.finalScore >= resource.passScore) {
                scoreText = '恭喜您，考试通过';
                scoreColor = '#0abb07';
            } else {
                scoreText = '很抱歉，考试不及格';
                scoreColor = '#e64340';
            }
            right = resAttendance.finalScore / resource.score * 100;
            subTitle = score + '分'
        }

        let windowWidth = 320;
        try {
            let res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        new wxCharts({
            animation: true,
            canvasId: 'ringCanvas',
            type: 'ring',
            extra: {
                ringWidth: 8,
                pie: {
                    offsetAngle: -90
                }
            },
            title: {
                name: scoreText,
                color: '#888888',
                fontSize: 12
            },
            subtitle: {
                name: subTitle,
                color: scoreColor,
                fontSize: 28
            },
            series: [{
                name: '得分',
                data: right,
                stroke: false,
                color: scoreColor
            }, {
                name: '失分',
                data: 100 - right,
                stroke: false,
                color: '#d6d6d6'
            }],
            disablePieStroke: true,
            width: windowWidth,
            height: 200,
            dataLabel: false,
            legend: false,
            background: '#f5f5f5',
            padding: 0
        });
    },

    _getScorePolicy: function (policy) {
        let scorePolicy = '成绩计算方式：';
        switch (policy) {
            case 'FIRST':
                scorePolicy += '取首次提交分数';
                break;
            case 'LAST':
                scorePolicy += '取最后一次提交分数';
                break;
            case 'MAX':
                scorePolicy += '取最高分';
                break;
            case 'AVG':
                scorePolicy += '取平均分';
                break;
        }
        return scorePolicy;
    }
});
