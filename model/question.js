const util = require('../utils/util');
const constants = require('../utils/constants');
const BLANK_PLACEHOLDER = '{|*|}';

class PaperSection {

    id = "";
    resourceId = "";
    type = "";
    title = "";
    description = "";
    index = -1;
    count = -1;
    score = -1;
    totalCount = -1;

    totalScore = -1;
    includeSubCatalogInd = "";

    questionList = [];

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.resourceId = data.resourceId;
            this.type = data.type;
            this.title = data.title;
            this.description = data.description;
            this.index = data.index;
            this.count = data.count;
            this.score = data.score;
            this.totalCount = data.totalCount;
            this.totalScore = data.otalScore;
            this.includeSubCatalogInd = data.includeSubCatalogInd;
        }
    }
}

class Question {
    id = "";
    title = "";
    score = -1;
    content = "";
    answer = "";
    type = "";
    category = "";
    sectionTitle = "";

    optionList = [];
    typeLabel = "";

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.title = data.title;
            this.score = data.score;
            this.content = data.content;
            this.answer = data.answer;
            this.type = data.type;
            this.category = data.category;

            switch (this.type) {
                case 'S':
                    this.typeLabel = '单选题';
                    break;
                case 'M':
                    this.typeLabel = '多选题';
                    break;
                case 'C':
                    this.typeLabel = '不定项';
                    break;
                case 'T':
                    this.typeLabel = '判断题';
                    break;
                case 'F':
                    this.typeLabel = '填空题';
                    break;
                case 'A':
                    this.typeLabel = '问答题';
                    break;
            }

            if (this.type == 'F') {
                let parts = this.content.split(BLANK_PLACEHOLDER);
                if (parts.length > 1) {
                    this.content = '';
                    for (let i = 0; i < parts.length - 1; i++) {
                        this.content += parts[i] + '__' + constants.BLANK_INDEX_LABEL.charAt(i) + '__';
                    }
                    if (parts[parts.length - 1]) {
                        this.content += parts[parts.length - 1];
                    }
                }
            }
        }
    }
}


class Option {
    id = "";
    questionId = "";
    index = -1;
    content = "";
    correctInd = false;
    score = -1;
    caseInd = false;
    total = "";
    optionTotal = "";

    indexLabel = ""; //将序号转成 A B C...
    checked = false; //页面控制选项是否已被选择;

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.questionId = data.questionId;
            this.index = data.index;
            this.content = data.content;
            this.correctInd = data.correctInd;
            this.score = data.score;
            this.caseInd = data.caseInd;
            this.total = data.total;
            this.optionTotal = data.optionTotal;

            this.indexLabel = constants.OPTION_INDEX_LABEL.charAt(this.index);
        }
    }
}

class PaperRecord {
    id = '';
    score;
    scoreStatus = -1;
    createdAt = '';
    attendanceStatus = '';
    statusText = '';
    learningSessionId = '';
    learningToken = '';

    activityEnrollmentId = '';
    resourceId = '';
    userId = '';
    createdBy = '';
    paperIndex = -1;

    questionRecords = [];

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.score = data.score;
            this.scoreStatus = data.scoreStatus;
            this.createdAt = data.createdAt;
            this.attendanceStatus = data.attendanceStatus;
            this.statusText = data.statusText;
            this.learningSessionId = data.learningSessionId;
            this.learningToken = data.learningToken;
            this.activityEnrollmentId = data.activityEnrollmentId;
            this.resourceId = data.resourceId;
            this.userId = data.userId;
            this.createdBy = data.createdBy;
            this.paperIndex = data.paperIndex;
        }
    }
}

class QuestionRecord {
    id = '';
    paperRecordId = '';
    questionId = '';
    type = '';
    answer = '';
    score;
    index = -1;
    correctStatus = -1;
    scoreStatus = -1;
    createdAt = '';
    createdBy = '';

    optionRecords = [];
    correctStatusLabel = '';
    isAnswered = false;

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.paperRecordId = data.paperRecordId;
            this.questionId = data.questionId;
            this.type = data.type;
            this.answer = data.answer;
            this.score = data.score;
            this.index = data.index;
            this.correctStatus = data.correctStatus;
            this.scoreStatus = data.scoreStatus;
            this.createdAt = data.createdAt;
            this.createdBy = data.createdBy;

            this.formatCorrectStatusLabel();
        }
    }

    formatCorrectStatusLabel() {
        switch(this.correctStatus) {
            case -1: this.correctStatusLabel = '没有答题'; break;
            case 0: this.correctStatusLabel = '错误'; break;
            case 1: this.correctStatusLabel = '部分正解'; break;
            case 2: this.correctStatusLabel = '完全正确'; break;
            default: this.correctStatusLabel = '--';
        }
    }

}

class OptionRecord {
    id = '';
    paperRecordId = '';
    questionRecordId = '';
    optionId = '';
    answer = '';
    score;
    correctInd = false;
    createdAt = '';
    createdBy = '';

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.paperRecordId = data.paperRecordId;
            this.questionRecordId = data.questionRecordId;
            this.optionId = data.optionId;
            this.answer = data.answer;
            this.score = data.score;
            this.correctInd = data.correctInd;
            this.createdAt = data.createdAt;
            this.createdBy = data.createdBy;
        }
    }
}


module.exports.PaperSection = PaperSection;
module.exports.Question = Question;
module.exports.Option = Option;
module.exports.PaperRecord = PaperRecord;
module.exports.QuestionRecord = QuestionRecord;
module.exports.OptionRecord = OptionRecord;
