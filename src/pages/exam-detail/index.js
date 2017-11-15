//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const model = require('../../model/activity');

Page({
    data: {
        id: '', //考试活动ID

        showEnrollBtn: true,
        showExamBtn: false,
        showHistoryBtn: false,
        examBtnLabel: '进入考试',
        examBtnDisabled: false,
        activity: null,
        attendance: null,
        resource: null,
        enrollment: null,
        resourceAttendance: null,
        first: true, //是否第一次显示
        showScore: false //是否显示分数
    },
    onLoad: function (option) {
        console.log('exam-detail onLoad', option);
        if (option.scene) {
            this.data.id = option.scene;
            if (app.isUserLogin()) {
                app.clearPath();
            }
        } else {
            this.data.id = option.id;
        }

        this._getRemoteData();
    },
    onShow: function () {
        if (!this.data.first) {
            try {
                wx.startPullDownRefresh();
            } catch (e) {
            }
        }
        this.data.first = false;
    },
    onPullDownRefresh: function () {
        this._getRemoteData();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, constants.PULL_DOWN_STOP_TIME);
    },

    /**
     * 处理报名
     */
    enroll: function () {
        http.post(http.URL_ENROLL, {activityId: this.data.id}, data => {
            if (data.code === 1) {
                let enrollment = new model.ActivityEnrollment();
                enrollment.id = data.enrollmentId;
                enrollment.status = 'ADMITTED';

                let btnAttr = this._getBtnEnterAttr(this.data.activity, enrollment,
                    this.data.resource, this.data.resourceAttendance);
                util.showToast(data.message);
                this.setData({
                    showEnrollBtn: this._isBtnEnrollShow(this.data.activity, enrollment),
                    showExamBtn: btnAttr.show,
                    examBtnLabel: btnAttr.label,
                    examBtnDisabled: btnAttr.disabled,
                    enrollment: enrollment,
                });
            } else {
                util.showAlert(data.message);
            }
        });
    },
    /**
     * 进入考试
     */
    enterExam: function () {
        let url = '/pages/exam-paper/index?activityId=' + this.data.id + '&resourceId=' + this.data.resource.id
            + '&activityEnrollmentId=' + this.data.enrollment.id + '&mode=' + constants.MODE_ANSWER
            + '&title=' + this.data.activity.title + '&time=' + this.data.resource.time;
        util.navigateTo(url);
    },
    goToHistory: function () {
        let url = '/pages/exam-history/index?activityId=' + this.data.id + '&resourceId=' + this.data.resource.id
            + '&enrollmentId=' + this.data.enrollment.id + '&title=' + this.data.activity.title;
        util.navigateTo(url);
    },
    _getRemoteData() {
        http.get(http.URL_EVALUATION_DETAIL, {activityId: this.data.id}, data => {
            let activity = new model.Activity(data);
            let resource = new model.Resource();
            let resourceAttendance = new model.ResourceAttendance();
            if (data.resources != null && data.resources.length > 0) {
                resource = new model.Resource(data.resources[0]);
                resourceAttendance = new model.ResourceAttendance(data.resources[0].attendance);
            }
            let attendance = new model.ActivityAttendance(data.extra.attendance);
            let enrollment = new model.ActivityEnrollment(data.extra.enrollment);
            let btnAttr = this._getBtnEnterAttr(activity, enrollment, resource, resourceAttendance);
            this.setData({
                showEnrollBtn: this._isBtnEnrollShow(activity, enrollment),
                showExamBtn: btnAttr.show,
                showHistoryBtn: this._isBtnHistoryShow(resourceAttendance),
                showScore: this._isScoreShow(resourceAttendance.status),
                examBtnLabel: btnAttr.label,
                examBtnDisabled: btnAttr.disabled,
                activity: activity,
                attendance: attendance,
                resource: resource,
                enrollment: enrollment,
                resourceAttendance: resourceAttendance
            });
        });
    },

    _isScoreShow(status) {
        return status === 'PASS' || status === 'FAIL';
    },

    _isBtnEnrollShow(activity, enrollment) {
        return activity.enrollInd && util.trim(enrollment.id) === '';
    },

    _isBtnHistoryShow(resourceAttendance) {
        return resourceAttendance.totalAttempt > 0;
    },

    _getBtnEnterAttr(activity, enrollment, resource, resourceAttendance) {
        let show = false;
        let label = '进入考试';
        let disabled = false;
        if (util.trim(activity.id) !== '' && util.trim(enrollment.id) !== '') {
            let status = enrollment.status;
            switch (status) {
                case 'ADMITTED': {
                    if (resourceAttendance.totalAttempt > 0) {
                        let totalAttempt = resourceAttendance.totalAttempt;
                        if (resource.attempt === 0 || resource.attempt - totalAttempt > 0) {
                            label = '再考一次';
                            show = true;
                            if (resourceAttendance.status === 'SCORING') {
                                show = true;
                                disabled = true;
                                label = '评分中';
                            }
                        }
                    } else {
                        label = '进入考试';
                        show = true;
                    }
                    break;
                }
                case 'PENDING': {
                    show = true;
                    disabled = true;
                    label = '待审批';
                    break;
                }
                case 'REJECTED': {
                    show = true;
                    disabled = true;
                    label = '已拒绝';
                    break;
                }
                case 'WITHDRAWN': {
                    show = true;
                    disabled = true;
                    label = '已放弃';
                    break;
                }
            }
        }
        return {
            show: show,
            label: label,
            disabled: disabled
        };
    }

});
