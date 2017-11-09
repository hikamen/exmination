const util = require('../utils/util');
const http = require('../utils/http');
const constants = require('../utils/constants');

class Department {
    id = '';
    name = '';
    defaultInd = false;

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.defaultInd = data.defaultInd;
        }
    }
}

module.exports = Department;
