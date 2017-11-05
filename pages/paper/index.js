//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const act_model = require('../../model/activity');
const que_model = require('../../model/question');

Page({
    data: {
        activityId: '', //考试活动ID
        resourceId: '', //资源（试卷）ID
        activityEnrollmentId: '', //报名ID
        mode: constants.MODE_ANSWER, //试卷模式
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
        total:0, //总题目数,
        show_answer: false, //是否显示标准答案,
        showSubmitBtn: true
    },
    onLoad: function (option) {
        console.log('paper', option);
        this.data.activityId = option.activityId;
        this.data.resourceId = option.resourceId;
        this.data.activityEnrollmentId = option.activityEnrollmentId;
        this.data.mode = option.mode;

        // this.data.activityId = "375763170083614720";
        // this.data.resourceId = "375763219953889280";
        // this.data.activityEnrollmentId = "376047100166811648";
        // this.data.mode = 'POST_ANSWER';
        this._getPaperData(0);

    },

    _isChoiceQuestion: function (type) {
        return type === 'S' || type === 'M' || type === 'C';
    },

    _getPaperData: function (index) {
        /*let data = [{
            "id": "375763220046163968",
            "resourceId": "375763219953889280",
            "type": "",
            "title": "第1部分",
            "description": null,
            "index": 1,
            "count": 0,
            "difficulty": 0,
            "score": 0.0,
            "catalogId": null,
            "totalScore": 15.0,
            "totalCount": 5,
            "includeSubCatalogInd": null,
            "questionList": [{
                "id": "375763220058746880",
                "orgId": "1",
                "referenceId": "918405714949439488",
                "title": "单选题",
                "description": "",
                "difficulty": 1,
                "score": 2.0,
                "explanation": null,
                "content": "1+1=？",
                "answer": null,
                "source": "IMP",
                "type": "S",
                "nativeInd": null,
                "category": "PAPER",
                "active": true,
                "createdAt": "2017-11-02 21:48:53.000",
                "createdBy": "6",
                "updatedAt": null,
                "updatedBy": null,
                "deletedAt": null,
                "deletedBy": null,
                "createdByName": null,
                "optionList": [{
                    "id": "375763220109078528",
                    "questionId": "375763220058746880",
                    "referenceId": "918405715037519872",
                    "index": 0,
                    "content": "1",
                    "correctInd": false,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220121661440",
                    "questionId": "375763220058746880",
                    "referenceId": "918405715062685696",
                    "index": 1,
                    "content": "2",
                    "correctInd": true,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220138438656",
                    "questionId": "375763220058746880",
                    "referenceId": "918405715117211648",
                    "index": 2,
                    "content": "3",
                    "correctInd": false,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220146827264",
                    "questionId": "375763220058746880",
                    "referenceId": "918405715146571776",
                    "index": 3,
                    "content": "4",
                    "correctInd": false,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }],
                "catalogs": [],
                "sectionId": "375763220046163968"
            }, {
                "id": "375763220197158912",
                "orgId": "1",
                "referenceId": "918405715737968640",
                "title": "多选题",
                "description": "",
                "difficulty": 3,
                "score": 2.0,
                "explanation": null,
                "content": "三原色包括（）",
                "answer": null,
                "source": "IMP",
                "type": "M",
                "nativeInd": null,
                "category": "PAPER",
                "active": true,
                "createdAt": "2017-11-02 21:48:53.000",
                "createdBy": "6",
                "updatedAt": null,
                "updatedBy": null,
                "deletedAt": null,
                "deletedBy": null,
                "createdByName": null,
                "optionList": [{
                    "id": "375763220218130432",
                    "questionId": "375763220197158912",
                    "referenceId": "918405715834437632",
                    "index": 0,
                    "content": "红",
                    "correctInd": true,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220226519040",
                    "questionId": "375763220197158912",
                    "referenceId": "918405715859603456",
                    "index": 1,
                    "content": "蓝",
                    "correctInd": true,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220247490560",
                    "questionId": "375763220197158912",
                    "referenceId": "918405715888963584",
                    "index": 2,
                    "content": "绿",
                    "correctInd": true,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220255879168",
                    "questionId": "375763220197158912",
                    "referenceId": "918405715918323712",
                    "index": 3,
                    "content": "黄",
                    "correctInd": false,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }],
                "catalogs": [],
                "sectionId": "375763220046163968"
            }, {
                "id": "375763220285239296",
                "orgId": "1",
                "referenceId": "918405716044152832",
                "title": "不定项选择题",
                "description": "",
                "difficulty": 4,
                "score": 5.0,
                "explanation": null,
                "content": "以下哪些动物拥有四条脚？",
                "answer": null,
                "source": "IMP",
                "type": "C",
                "nativeInd": null,
                "category": "PAPER",
                "active": true,
                "createdAt": "2017-11-02 21:48:53.000",
                "createdBy": "6",
                "updatedAt": null,
                "updatedBy": null,
                "deletedAt": null,
                "deletedBy": null,
                "createdByName": null,
                "optionList": [{
                    "id": "375763220318793728",
                    "questionId": "375763220285239296",
                    "referenceId": "918405716119650304",
                    "index": 0,
                    "content": "鸡",
                    "correctInd": false,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220331376640",
                    "questionId": "375763220285239296",
                    "referenceId": "918405716144816128",
                    "index": 1,
                    "content": "蛇",
                    "correctInd": false,
                    "score": 0.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220339765248",
                    "questionId": "375763220285239296",
                    "referenceId": "918405716169981952",
                    "index": 2,
                    "content": "狗",
                    "correctInd": true,
                    "score": 3.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220352348160",
                    "questionId": "375763220285239296",
                    "referenceId": "918405716190953472",
                    "index": 3,
                    "content": "猫",
                    "correctInd": true,
                    "score": 2.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }],
                "catalogs": [],
                "sectionId": "375763220046163968"
            }, {
                "id": "375763220385902592",
                "orgId": "1",
                "referenceId": "918405716320976896",
                "title": "判断题",
                "description": "",
                "difficulty": 2,
                "score": 1.0,
                "explanation": null,
                "content": "太阳比月亮大？",
                "answer": "true",
                "source": "IMP",
                "type": "T",
                "nativeInd": null,
                "category": "PAPER",
                "active": true,
                "createdAt": "2017-11-02 21:48:53.000",
                "createdBy": "6",
                "updatedAt": null,
                "updatedBy": null,
                "deletedAt": null,
                "deletedBy": null,
                "createdByName": null,
                "optionList": [],
                "catalogs": [],
                "sectionId": "375763220046163968"
            }, {
                "id": "375763220436234240",
                "orgId": "1",
                "referenceId": "918405716723630080",
                "title": "填空题",
                "description": "",
                "difficulty": 5,
                "score": 5.0,
                "explanation": null,
                "content": "地球上最大海洋是{|*|}，最高的山峰是{|*|}",
                "answer": "太平洋\n珠穆朗玛",
                "source": "IMP",
                "type": "F",
                "nativeInd": null,
                "category": "PAPER",
                "active": true,
                "createdAt": "2017-11-02 21:48:53.000",
                "createdBy": "6",
                "updatedAt": null,
                "updatedBy": null,
                "deletedAt": null,
                "deletedBy": null,
                "createdByName": null,
                "optionList": [{
                    "id": "375763220465594368",
                    "questionId": "375763220436234240",
                    "referenceId": "918405716786544640",
                    "index": 0,
                    "content": "太平洋",
                    "correctInd": false,
                    "score": 2.0,
                    "explanation": null,
                    "caseInd": true,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }, {
                    "id": "375763220478177280",
                    "questionId": "375763220436234240",
                    "referenceId": "918405716920762368",
                    "index": 1,
                    "content": "珠穆朗玛峰",
                    "correctInd": false,
                    "score": 3.0,
                    "explanation": null,
                    "caseInd": false,
                    "image": null,
                    "total": null,
                    "optionTotal": null
                }],
                "catalogs": [],
                "sectionId": "375763220046163968"
            }, {
                "id": "898127988548173824",
                "orgId": "1",
                "referenceId": "891903903124160512",
                "title": "问答题",
                "description": "",
                "difficulty": 5,
                "score": 20,
                "explanation": null,
                "content": "简述二进制原理",
                "answer": "吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦",
                "source": "IMP",
                "type": "A",
                "nativeInd": null,
                "category": "PAPER",
                "active": true,
                "createdAt": "2017-08-17 18:22",
                "createdBy": "6",
                "updatedAt": null,
                "updatedBy": null,
                "deletedAt": null,
                "deletedBy": null,
                "createdByName": null,
                "optionList": [],
                "catalogs": [],
                "sectionId": "898127988317487104"
            }],
            "catalogTitle": null
        }];

        this.data.questionList = this._parsePaperData(data);
        this.setData({
            total: this.data.questionList.length,
            disabled: this.data.mode === constants.MODE_POST_ANSWER
        });
        for(let i=0; i<this.data.questionList.length; i++) {
            let que = this.data.questionList[i];
            let queRecord = new que_model.QuestionRecord();
            queRecord.questionId = que.id;
            queRecord.type = que.type;
            queRecord.index = i;
            this.data.questionRecords.push(queRecord);
        }
        this._setCurrentQuestion(index);*/


       let params = {
           activityId: this.data.activityId,
           activityEnrollmentId: this.data.activityEnrollmentId
       };
       http.get(http.URL_OPEN_PAPER + this.data.resourceId, params, result=> {
           this.data.learningSessionId = result.learningSessionId;
           this.data.learningToken = result.learningToken;

           params.resourceId = this.data.resourceId;
           params.mode = this.data.mode;
           params.learningSessionId = result.learningSessionId;
           http.get(http.URL_GET_PAPER_DATA, params, data=> {
               this.data.questionList = this._parsePaperData(data);
               this.setData({
                   total: this.data.questionList.length,
                   disabled: this.data.mode === constants.MODE_POST_ANSWER
               });
               if(this.data.mode === constants.MODE_POST_ANSWER) {
                   this._getAnswerData(index);
               } else {
                   for(let i=0; i<this.data.questionList.length; i++) {
                       let que = this.data.questionList[i];
                       let queRecord = new que_model.QuestionRecord();
                       queRecord.questionId = que.id;
                       queRecord.type = que.type;
                       queRecord.index = i;
                       this.data.questionRecords.push(queRecord);
                   }
                   this._setCurrentQuestion(index);
               }
           });
       });

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
    _formatChoiceAnswer: function(question, option) {
        question.answer = question.answer || '';
        if (this._isChoiceQuestion(question.type)) {
            if (option.correctInd) {
                question.answer += option.indexLabel + ' ';
            }
        }
    },
    _getAnswerData: function (index) {
        /*var resp = {
            "code": 1,
            "message": null,
            "data": {
                "id": "376484159067140096",
                "activityEnrollmentId": "376047100166811648",
                "learningSessionId": "e782219e-362e-4062-9c41-8fc9cdea66b4",
                "resourceId": "375763219953889280",
                "userId": "918394212112662528",
                "score": 15.0,
                "scoreStatus": 2,
                "autoInd": false,
                "createdAt": "2017-11-04 21:33:38.000",
                "createdBy": "918394212112662528",
                "paperIndex": 1,
                "attendanceStatus": "PASS",
                "nickname": null,
                "username": null,
                "questionRecords": [{
                    "id": "376484159096500224",
                    "paperRecordId": "376484159067140096",
                    "questionId": "375763220058746880",
                    "type": "S",
                    "answer": null,
                    "score": 2.0,
                    "index": 0,
                    "correctStatus": 2,
                    "scoreStatus": 2,
                    "createdAt": "2017-11-04 21:33:38.000",
                    "createdBy": "918394212112662528",
                    "optionRecords": [{
                        "id": "376484159142637568",
                        "paperRecordId": "376484159067140096",
                        "questionRecordId": "376484159096500224",
                        "optionId": "375763220121661440",
                        "answer": null,
                        "score": 0.0,
                        "correctInd": true,
                        "createdAt": "2017-11-04 21:33:38.000",
                        "createdBy": "918394212112662528"
                    }]
                }, {
                    "id": "376484159167803392",
                    "paperRecordId": "376484159067140096",
                    "questionId": "375763220197158912",
                    "type": "M",
                    "answer": null,
                    "score": 2.0,
                    "index": 1,
                    "correctStatus": 2,
                    "scoreStatus": 2,
                    "createdAt": "2017-11-04 21:33:38.000",
                    "createdBy": "918394212112662528",
                    "optionRecords": [{
                        "id": "376484159222329344",
                        "paperRecordId": "376484159067140096",
                        "questionRecordId": "376484159167803392",
                        "optionId": "375763220218130432",
                        "answer": null,
                        "score": 0.0,
                        "correctInd": true,
                        "createdAt": "2017-11-04 21:33:38.000",
                        "createdBy": "918394212112662528"
                    }, {
                        "id": "376484159285243904",
                        "paperRecordId": "376484159067140096",
                        "questionRecordId": "376484159167803392",
                        "optionId": "375763220226519040",
                        "answer": null,
                        "score": 0.0,
                        "correctInd": true,
                        "createdAt": "2017-11-04 21:33:38.000",
                        "createdBy": "918394212112662528"
                    }, {
                        "id": "376484159343964160",
                        "paperRecordId": "376484159067140096",
                        "questionRecordId": "376484159167803392",
                        "optionId": "375763220247490560",
                        "answer": null,
                        "score": 0.0,
                        "correctInd": true,
                        "createdAt": "2017-11-04 21:33:38.000",
                        "createdBy": "918394212112662528"
                    }]
                }, {
                    "id": "376484159398490112",
                    "paperRecordId": "376484159067140096",
                    "questionId": "375763220285239296",
                    "type": "C",
                    "answer": null,
                    "score": 5.0,
                    "index": 2,
                    "correctStatus": 2,
                    "scoreStatus": 2,
                    "createdAt": "2017-11-04 21:33:38.000",
                    "createdBy": "918394212112662528",
                    "optionRecords": [{
                        "id": "376484159432044544",
                        "paperRecordId": "376484159067140096",
                        "questionRecordId": "376484159398490112",
                        "optionId": "375763220339765248",
                        "answer": null,
                        "score": 3.0,
                        "correctInd": true,
                        "createdAt": "2017-11-04 21:33:38.000",
                        "createdBy": "918394212112662528"
                    }, {
                        "id": "376484159499153408",
                        "paperRecordId": "376484159067140096",
                        "questionRecordId": "376484159398490112",
                        "optionId": "375763220352348160",
                        "answer": null,
                        "score": 2.0,
                        "correctInd": true,
                        "createdAt": "2017-11-04 21:33:38.000",
                        "createdBy": "918394212112662528"
                    }]
                }, {
                    "id": "376484159666925568",
                    "paperRecordId": "376484159067140096",
                    "questionId": "375763220385902592",
                    "type": "T",
                    "answer": "true",
                    "score": 1.0,
                    "index": 3,
                    "correctStatus": 2,
                    "scoreStatus": 2,
                    "createdAt": "2017-11-04 21:33:38.000",
                    "createdBy": "918394212112662528",
                    "optionRecords": []
                }, {
                    "id": "376484159813726208",
                    "paperRecordId": "376484159067140096",
                    "questionId": "375763220436234240",
                    "type": "F",
                    "answer": null,
                    "score": 5.0,
                    "index": 4,
                    "correctStatus": 2,
                    "scoreStatus": 2,
                    "createdAt": "2017-11-04 21:33:38.000",
                    "createdBy": "918394212112662528",
                    "optionRecords": [{
                        "id": "376484159855669248",
                        "paperRecordId": "376484159067140096",
                        "questionRecordId": "376484159813726208",
                        "optionId": "375763220465594368",
                        "answer": "太平洋",
                        "score": 2.0,
                        "correctInd": true,
                        "createdAt": "2017-11-04 21:33:38.000",
                        "createdBy": "918394212112662528"
                    }, {
                        "id": "376484159918583808",
                        "paperRecordId": "376484159067140096",
                        "questionRecordId": "376484159813726208",
                        "optionId": "375763220478177280",
                        "answer": "珠穆朗玛峰",
                        "score": 3.0,
                        "correctInd": true,
                        "createdAt": "2017-11-04 21:33:38.000",
                        "createdBy": "918394212112662528"
                    }]
                },{
                    "id": "901390620352839680",
                    "paperRecordId": "901390620134735872",
                    "questionId": "901374728248229888",
                    "type": "A",
                    "answer": "吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦", /!*问答题，用户回答的答案*!/
                    "score": 0,
                    "index": 5,
                    "correctStatus": null,
                    "scoreStatus": 1,
                    "createdAt": "2017-08-26 18:27",
                    "createdBy": "901373566010785792",
                    "optionRecords": [ ]
                }]
            }
        };*/
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
            this.data.questionRecords = paperRecord.questionRecords;
            this._setCurrentQuestion(index);
        });
    },
    goPrevious: function () {
       if(this.data.currentIndex > 0) {
           this._setCurrentQuestion(this.data.currentIndex  -1);
       }
    },
    goNext: function() {
        if(this.data.currentIndex < this.data.questionList.length-1) {
            this._setCurrentQuestion(this.data.currentIndex  +1);
        }
    },
    /**
     * 处理单选题和判断题输入
     * @param event
     */
    radioChangeHandle: function (event) {
        console.log(event);
        let questionRecord = this.data.questionRecords[this.data.currentIndex];
        if(questionRecord.type === 'S') {
            questionRecord.optionRecords = [];
            let optionRecord = new que_model.OptionRecord();
            optionRecord.optionId = event.detail.value;
            questionRecord.optionRecords.push(optionRecord);
        } else {
            questionRecord.answer = event.detail.value;
        }
    },
    /**
     * 处理多选题和不定项题输入
     * @param event
     */
    checkboxChangeHandle: function(event) {
        console.log(event);
        let questionRecord = this.data.questionRecords[this.data.currentIndex];
        questionRecord.optionRecords = [];
        if(event.detail.value && event.detail.value.length>0) {
            for(let val of event.detail.value) {
                let optionRecord = new que_model.OptionRecord();
                optionRecord.optionId = val;
                questionRecord.optionRecords.push(optionRecord);
            }
        }
    },
    /**
     * 处理填空题输入
     * @param event
     */
    blankInputHandle: function (event) {
        console.log(event);
        let questionRecord = this.data.questionRecords[this.data.currentIndex];
        if(questionRecord.optionRecords.length === 0) {
            for(let opt of this.data.question.optionList) {
                let optionRecord = new que_model.OptionRecord();
                optionRecord.optionId = opt.id;
                questionRecord.optionRecords.push(optionRecord);
            }
        }
        let index = event.currentTarget.dataset.index;
        questionRecord.optionRecords[index].answer = event.detail.value;
    },
    /**
     * 处理问答题输入
     * @param event
     */
    textareaHandle: function (event) {
        console.log(event);
        let questionRecord =this.data.questionRecords[this.data.currentIndex];
        questionRecord.answer = event.detail.value;
    },
    submitHandle: function () {
        console.log(this.data.questionRecords);
        let paperRecord = new que_model.PaperRecord();
        paperRecord.activityEnrollmentId = this.data.activityEnrollmentId;
        paperRecord.learningSessionId = this.data.learningSessionId;
        paperRecord.resourceId = this.data.resourceId;
        paperRecord.autoInd = false;
        paperRecord.questionRecords = this.data.questionRecords;
        var params = {
            'data': JSON.stringify(paperRecord),
            'activityId': this.data.activityId,
            'activityEnrollmentId': this.data.activityEnrollmentId,
            'learningToken': this.data.learningToken
        };
        console.log(params);
        http.post(http.URL_SUBMIT_PAPER+this.data.resourceId, params, data => {
            console.log(data);
        });
    },
    _setCurrentQuestion: function (i) {
        let question = this.data.questionList[i];
        let questionRecord =  this.data.questionRecords[i];
        if(questionRecord && this._isChoiceQuestion(question.type)) {
            for(let opt of question.optionList) {
                if(questionRecord.optionRecords && questionRecord.optionRecords.length>0) {
                    for(let optRecord of questionRecord.optionRecords) {
                        if(optRecord.optionId === opt.id) {
                            opt.checked = true;
                            break;
                        }
                    }
                }
            }
        }
        let previousBtnDisabled = false;
        let nextBtnDisabled = false;
        let showSubmitBtn = false;
        if(i === 0) {
            previousBtnDisabled = true;
        }
        if(i=== this.data.questionList.length-1) {
            nextBtnDisabled = true;
            showSubmitBtn = true;
        }
        this.setData({
            currentIndex: i,
            question: question,
            questionRecord: questionRecord,
            previousBtnDisabled: previousBtnDisabled,
            nextBtnDisabled: nextBtnDisabled,
            showSubmitBtn: showSubmitBtn
        });
    }
});
