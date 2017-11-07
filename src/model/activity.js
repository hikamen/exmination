const util = require('../utils/util');
const http = require('../utils/http');

/**
 * 考试活动
 */
class Activity {
    id = '';
    title = '';
    enrollStartDatetime = '';
    enrollEndDatetime = '';
    enrollDatetime = '';
    objective = '';
    description = '';

    coverUrl = '';

    enrollInd = false; //是否允许报名

    constructor(data) {
        console.log(data);
        if (data) {
            this.id = data.id;
            this.title = data.title;
            this.enrollStartDatetime = util.formatDatetime(data.enrollStartDatetime);
            this.enrollEndDatetime = util.formatDatetime(data.enrollEndDatetime);
            this.objective = data.objective;
            this.description = data.description;
            if (data.extra) {
                this.enrollInd = data.extra.enrollInd;
            }
            if(data.cover && data.cover.files && data.cover.files.length>0) {
                this.coverUrl = http.SERVER_NAME + data.cover.files[0].url;
            }
            this.format();
        }
    }

    format() {
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

/**
 * 试卷资源
 */
class Resource {
    id = '';
    title = '';
    score = -1;
    passPercentage = -1;
    attempt = -1;
    attemptPolicy = '';
    time = -1;
    paperType = '';
    paperAllowPauseInd = false;
    paperDisplayMode = '';
    paperDisplayAnswerMode = '';
    paperScorePolicy = '';
    type = '';

    passScore = -1;

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.title = data.title;
            this.score = data.score;
            this.passPercentage = data.passPercentage;
            this.attempt = data.attempt;
            this.attemptPolicy = data.attemptPolicy;
            this.time = data.time;
            this.paperType = data.paperType;
            this.paperAllowPauseInd = data.paperAllowPauseInd;
            this.paperDisplayMode = data.paperDisplayMode;
            this.paperDisplayAnswerMode = data.paperDisplayAnswerMode;
            this.paperScorePolicy = data.paperScorePolicy;
            this.type = data.type;
            this.calPassScore();
        }
    }

    calPassScore() {
        this.passScore = this.score * this.passPercentage / 100;
    }
}

/**
 * 考试活动报名
 */
class ActivityEnrollment {
    id = '';
    activityId = '';
    userId = '';
    status = '';

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.activityId = data.activityId;
            this.userId = data.userId;
            this.status = data.status;
        }
    }
}

/**
 * 考试活动成绩
 */
export class ActivityAttendance {
    id = '';
    activityId = '';
    activityEnrollmentId = '';
    userId = '';
    status = '';
    commenceDatetime = '';
    completeDatetime = '';
    totalAttempt = 0;
    totalTime = '';
    score = -1;
    finalScore = -1;

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.activityId = data.activityId;
            this.activityEnrollmentId = data.activityEnrollmentId;
            this.userId = data.userId;
            this.status = data.status;
            this.commenceDatetime = data.commenceDatetime;
            this.completeDatetime = data.completeDatetime;
            this.totalAttempt = data.totalAttempt;
            this.totalTime = data.totalTime;
            this.score = data.score;
            this.finalScore = data.finalScore;
        }
    }
}

class ResourceAttendance {
    id = '';
    activityId = '';
    activityEnrollmentId = '';
    activityAttendanceId = '';
    resourceId = '';
    userId = '';
    status = '';
    totalAttempt = 0;
    score = -1;
    finalScore = -1;

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.activityId = data.activityId;
            this.activityEnrollmentId = data.activityEnrollmentId;
            this.activityAttendanceId = data.activityAttendanceId;
            this.resourceId = data.resourceId;
            this.userId = data.userId;
            this.status = data.status;
            this.totalAttempt = data.totalAttempt;
            this.score = data.score;
            this.finalScore = data.finalScore;
        }
    }
}

module.exports.Activity = Activity;
module.exports.Resource = Resource;
module.exports.ActivityEnrollment = ActivityEnrollment;
module.exports.ActivityAttendance = ActivityAttendance;
module.exports.ResourceAttendance = ResourceAttendance;

