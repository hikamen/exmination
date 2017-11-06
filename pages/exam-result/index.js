//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const que_model = require('../../model/question');

Page({
    data: {
        resourceId: '',
        learningSessionId: '',
        activityEnrollmentId: '',
        activityId: '',
        title: '',
        questionRecords: []
    },
    onLoad: function (option) {
        console.log(option);
        this.data.resourceId = option.resourceId;
        this.data.learningSessionId = option.learningSessionId;
        this.data.activityEnrollmentId = option.activityEnrollmentId;
        this.data.title = option.title;
        this.data.activityId = option.activityId;

        // this.data.resourceId = '375763219953889280';
        // this.data.learningSessionId = 'd6bc9c9f-e081-4c9d-8db4-6769c6ca8808';
        // this.data.activityEnrollmentId = '377147314327924736';
        // this.data.title = '试卷';
        // this.data.activityId = '375763170083614720';

        this._getRemoteDate();
    },
    _getRemoteDate: function () {
        let params = {
            resourceId: this.data.resourceId,
            learningSessionId: this.data.learningSessionId,
            activityEnrollmentId: this.data.activityEnrollmentId,
            autoInd: false
        };
        http.get(http.URL_GET_ANSWER_DATA, params, data => {
            let paperRecord = new que_model.PaperRecord(data);
            if (data.questionRecords && data.questionRecords.length > 0) {
                for (let que of data.questionRecords) {
                    let questionRecord = new que_model.QuestionRecord(que);
                    paperRecord.questionRecords.push(questionRecord);
                }
            }
            this.setData({
                questionRecords: paperRecord.questionRecords
            })
        });
    },
    viewPaper: function (event) {
        console.log(event);
        let url = '/pages/exam-paper/index?activityId=' + this.data.activityId + '&resourceId=' + this.data.resourceId
            + '&activityEnrollmentId=' + this.data.activityEnrollmentId+ '&mode=' + constants.MODE_POST_ANSWER
            + '&title=' + this.data.title + '&questionIndex='+event.currentTarget.dataset.index
            +'&learningSessionId='+this.data.learningSessionId;
        util.navigateTo(url);
    }

});
