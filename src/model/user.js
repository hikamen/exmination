const util = require('../utils/util');
const http = require('../utils/http');
const constants = require('../utils/constants');

class User {
    id = '';
    username = '';
    nickname = '';
    fullname = '';
    userAvatar = '';

    constructor(data) {
        if (data) {
            this.id = data.id;
            this.username = data.username;
            this.nickname = data.nickname;
            this.fullname = data.fullname;
            if(data.avatar && data.avatar.files && data.avatar.files.length > 0) {
                this.userAvatar = http.SERVER_NAME + data.avatar.files[0].url;
            }
            if (data.userAvatar) {
                this.userAvatar = http.SERVER_NAME + data.userAvatar;
            }
        }
    }
}

module.exports = User;
