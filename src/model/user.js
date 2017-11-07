const util = require('../utils/util');
const http = require('../utils/http');
const constants = require('../utils/constants');

class User {
    id = '';
    username = '';
    nickname = '';
    userAvatar = '';

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.username = data.username;
            this.nickname = data.nickname;
            if (data.userAvatar) {
                this.userAvatar = http.SERVER_NAME + data.userAvatar;
            }
        }
    }
}

module.exports = User;
