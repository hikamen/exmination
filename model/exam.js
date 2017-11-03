const util = require('../utils/util');

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

module.exports.Exam = Exam;

