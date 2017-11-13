//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const act_model = require('../../model/activity');
const que_model = require('../../model/question');
const moment = require('../../libs/moment/we-moment');

let pageData = {
    activityId: '', //考试活动ID
    resourceId: '', //资源（试卷）ID
    activityEnrollmentId: '', //报名ID
    mode: constants.MODE_ANSWER, //试卷模式
    timeInMinute: '', //

    learningSessionId: '', //考试历史记录会话ID
    learningToken: '', //考试token
    questionList: [], //题目列表
    questionRecords: [], //题目答题列表
    question: null, //当前题目
    questionRecord: null, //当前题目对应的答题数据和评分
    currentIndex: 0, //当前题目的序号
    previousBtnDisabled: true,
    nextBtnDisabled: false,
    disabled: false, //页面控制选项是否可选;
    total: 0, //总题目数,
    show_answer: false, //是否显示标准答案,
    showSubmitBtn: true, //是否显示提交按钮
    timeInSecond: 0,
    showTimer: false,
    timer: null,
    remainingTime: '', //页面上显示的倒数时间
    intervalId: -1, //控制计时器倒数的实例ID,
    allowPause: false,
    warningTime: false, //控制页面上倒计时的样式，时间快到时红色显示
    showDialog: false
};
Page({
    data: pageData,
    onLoad: function (option) {
        this.data.activityId = option.activityId;
        this.data.resourceId = option.resourceId;
        this.data.activityEnrollmentId = option.activityEnrollmentId;
        this.data.mode = option.mode;
        if (option.questionIndex) {
            this.data.currentIndex = parseInt(option.questionIndex);
        }
        if (option.learningSessionId) {
            this.data.learningSessionId = option.learningSessionId;
        }
        let timeInMinute = util.trim(option.time);
        this.data.timeInMinute = timeInMinute;

        if (timeInMinute !== '' && timeInMinute !== '0' && this.data.mode === constants.MODE_ANSWER) {
            this.data.timeInSecond = parseInt(timeInMinute) * 60;
            this.data.timer = moment('00:00:00', constants.TIME_FORMAT).seconds(this.data.timeInSecond);
            this.setData({
                showTimer: true
            });
        }

        wx.setNavigationBarTitle({
            title: option.title || ''
        });

        this._openPaper(this.data.currentIndex);
    },
    goPrevious: function () {
        if (this.data.currentIndex > 0) {
            this._setCurrentQuestion(this.data.currentIndex - 1);
        }
    },
    goNext: function () {
        if (this.data.currentIndex < this.data.questionList.length - 1) {
            this._setCurrentQuestion(this.data.currentIndex + 1);
        }
    },
    /**
     * 处理单选题和判断题输入
     * @param event
     */
    radioChangeHandle: function (event) {
        let questionRecord = this.data.questionRecords[this.data.currentIndex];
        if (questionRecord.type === 'S') {
            questionRecord.optionRecords = [];
            let optionRecord = new que_model.OptionRecord();
            optionRecord.optionId = event.detail.value;
            questionRecord.optionRecords.push(optionRecord);
        } else {
            questionRecord.answer = event.detail.value;
        }
        questionRecord.isAnswered = true;
    },
    /**
     * 处理多选题和不定项题输入
     * @param event
     */
    checkboxChangeHandle: function (event) {
        let questionRecord = this.data.questionRecords[this.data.currentIndex];
        questionRecord.optionRecords = [];
        if (event.detail.value && event.detail.value.length > 0) {
            for (let val of event.detail.value) {
                let optionRecord = new que_model.OptionRecord();
                optionRecord.optionId = val;
                questionRecord.optionRecords.push(optionRecord);
            }
            questionRecord.isAnswered = true;
        } else {
            questionRecord.isAnswered = false;
        }
    },
    /**
     * 处理填空题输入
     * @param event
     */
    blankInputHandle: function (event) {
        let questionRecord = this.data.questionRecords[this.data.currentIndex];
        if (questionRecord.optionRecords.length === 0) {
            for (let opt of this.data.question.optionList) {
                let optionRecord = new que_model.OptionRecord();
                optionRecord.optionId = opt.id;
                questionRecord.optionRecords.push(optionRecord);
            }
        }
        let index = event.currentTarget.dataset.index;
        questionRecord.optionRecords[index].answer = event.detail.value;

        let isAnswered = false;
        for (let optRecord of questionRecord.optionRecords) {
            if (util.trim(optRecord.answer) !== '') {
                isAnswered = true;
                break;
            }
        }
        questionRecord.isAnswered = isAnswered;
    },
    /**
     * 处理问答题输入
     * @param event
     */
    textareaHandle: function (event) {
        let questionRecord = this.data.questionRecords[this.data.currentIndex];
        questionRecord.answer = event.detail.value;
        if (util.trim(questionRecord.answer) !== '') {
            questionRecord.isAnswered = true;
        } else {
            questionRecord.isAnswered = false;
        }
    },
    showDialog: function () {
        this.setData({
            questionRecords: this.data.questionRecords,
            showDialog: true
        });
    },
    hideDialog: function () {
        this.setData({
            showDialog:false
        });
    },
    goToQuestion: function (event) {
        let index = event.currentTarget.dataset.index;
        this._setCurrentQuestion(index);
        this.setData({
            showDialog: false
        });
    },
    submitHandle: function (force) {
        if (force === true) {
            util.showAlert('考试时间已经结束，即将自动提交试卷', () => {
                this._doSubmit();
            })
        } else
            this._checkUserAnswer(() => {
                this._doSubmit();
            });
    },

    _isChoiceQuestion: function (type) {
        return type === 'S' || type === 'M' || type === 'C';
    },

    _openPaper: function (index) {
        if (this.data.mode === constants.MODE_ANSWER) {
            let params = {
                activityId: this.data.activityId,
                activityEnrollmentId: this.data.activityEnrollmentId
            };
            http.get(http.URL_OPEN_PAPER + this.data.resourceId, params, result => {
                this.data.learningSessionId = result.learningSessionId;
                this.data.learningToken = result.learningToken;
                this._getPaperData(index);
            });
        } else {
            this._getPaperData(index);
        }

    },
    _getPaperData: function (index) {
        let params = {
            activityId: this.data.activityId,
            activityEnrollmentId: this.data.activityEnrollmentId,
            resourceId: this.data.resourceId,
            mode: this.data.mode,
            learningSessionId: this.data.learningSessionId
        };

        http.get(http.URL_GET_PAPER_DATA, params, data => {
            this.data.questionList = this._parsePaperData(data);
            this.setData({
                total: this.data.questionList.length,
                disabled: this.data.mode === constants.MODE_POST_ANSWER,
                show_answer: this.data.mode === constants.MODE_POST_ANSWER
            });
            if (this.data.mode === constants.MODE_POST_ANSWER) {
                this._getAnswerData(index);
            } else {
                let questionRecords = [];
                for (let i = 0; i < this.data.questionList.length; i++) {
                    let que = this.data.questionList[i];
                    let queRecord = new que_model.QuestionRecord();
                    queRecord.questionId = que.id;
                    queRecord.type = que.type;
                    queRecord.index = i;
                    questionRecords.push(queRecord);
                }
                this.setData({
                    questionRecords: questionRecords
                });
                this._setCurrentQuestion(index);
                util.showAlert('考试即将开始，请不要随意返回或者关闭小程序，以免造成答题数据丢失，祝您考试成功！');
            }
            this._startTimer();
        });
    },
    _startTimer: function () {
        if (this.data.timeInSecond > 0) {
            this.data.intervalId = setInterval(() => {
                this.data.timer.subtract(1, 'seconds');
                this.data.timeInSecond--;
                this.setData({
                    remainingTime: this.data.timer.format('HH:mm:ss')
                });
                if (this.data.timeInSecond === 0 || this.data.allowPause) {
                    clearInterval(this.data.intervalId); //停止倒计时
                    if (this.data.timeInSecond === 0) {
                        this.submitHandle(true);
                    }
                }
                if (this.data.timeInSecond === constants.WARNING_TIME) {
                    this.setData({
                        warningTime: true
                    });
                }
            }, 1000);
        }
    },
    _parsePaperData: function (data) {
        let sectionList = [], questionList = [];
        for (let sec of data) {
            let section = new que_model.PaperSection(sec);
            if (sec.questionList && sec.questionList.length > 0) {
                for (let que of sec.questionList) {
                    let question = new que_model.Question(que);
                    question.sectionTitle = section.title;
                    if (que.optionList && que.optionList.length > 0) {
                        for (let opt of que.optionList) {
                            let option = new que_model.Option(opt);
                            question.optionList.push(option);
                            this._formatChoiceAnswer(question, option);
                        }
                    }
                    section.questionList.push(question);
                }
            }
            questionList = questionList.concat(section.questionList);
            sectionList.push(section);
        }
        return questionList;
    },
    _formatChoiceAnswer: function (question, option) {
        question.answer = question.answer || '';
        if (this._isChoiceQuestion(question.type)) {
            if (option.correctInd) {
                question.answer += option.indexLabel + ' ';
            }
        }
    },
    _getAnswerData: function (index) {
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
                    if (que.optionRecords && que.optionRecords.length > 0) {
                        for (let opt of que.optionRecords) {
                            let optionRecord = new que_model.OptionRecord(opt);
                            questionRecord.optionRecords.push(optionRecord);
                        }
                    }
                }
            }
            this.setData({
                questionRecords: paperRecord.questionRecords
            });
            this._setCurrentQuestion(index);
        });
    },

    _doSubmit: function () {
        let paperRecord = new que_model.PaperRecord();
        paperRecord.activityEnrollmentId = this.data.activityEnrollmentId;
        paperRecord.learningSessionId = this.data.learningSessionId;
        paperRecord.resourceId = this.data.resourceId;
        paperRecord.autoInd = false;
        paperRecord.questionRecords = this.data.questionRecords;
        let params = {
            'data': JSON.stringify(paperRecord),
            'activityId': this.data.activityId,
            'activityEnrollmentId': this.data.activityEnrollmentId,
            'learningToken': this.data.learningToken
        };
        http.post(http.URL_SUBMIT_PAPER + this.data.resourceId, params, data => {
            util.showAlert('恭喜您已经成功提交试卷，请稍后查看评分', () => {
                wx.navigateBack();
            });
        });
    },
    _checkUserAnswer: function (callback) {
        if (this.data.questionRecords.length > 0) {
            let missing = [];
            for (let record of this.data.questionRecords) {
                if (!record.isAnswered) {
                    missing.push(record.index + 1);
                }
            }
            if (missing.length > 0) {
                util.showConfirm('您还有' + missing.length + '道题目，题号(' + missing.join('、') + ')还没问答，确认提交吗？',
                    callback);
            } else {
                util.showConfirm('您已经回答完所有题目，确认提交吗？', callback);
            }
        }
    },
    _setCurrentQuestion: function (index) {
        let question = this.data.questionList[index];
        let questionRecord = this.data.questionRecords[index];
        this._preProcessOptionChecked(question, questionRecord);
        let previousBtnDisabled = false;
        let nextBtnDisabled = false;
        let showSubmitBtn = false;
        if (index === 0) {
            previousBtnDisabled = true;
        }
        if (index === this.data.questionList.length - 1) {
            nextBtnDisabled = true;
            if (this.data.mode === constants.MODE_ANSWER) {
                showSubmitBtn = true;
            }
        }
        this.setData({
            currentIndex: index,
            question: question,
            questionRecord: questionRecord,
            previousBtnDisabled: previousBtnDisabled,
            nextBtnDisabled: nextBtnDisabled,
            showSubmitBtn: showSubmitBtn
        });
    },
    _preProcessOptionChecked: function (question, questionRecord) {
        if (questionRecord && this._isChoiceQuestion(question.type)) {
            for (let opt of question.optionList) {
                if (questionRecord.optionRecords && questionRecord.optionRecords.length > 0) {
                    for (let optRecord of questionRecord.optionRecords) {
                        if (optRecord.optionId === opt.id) {
                            opt.checked = true;
                            break;
                        }
                    }
                }
            }
        }
    }
});
