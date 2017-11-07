const util = require('../utils/util');
const constants = require('../utils/constants');

class Rank {
    user = null;
    score = -1;
    ranking = -1;

    constructor(user, score, ranking) {
        this.user = user;
        this.score = score;
        this.ranking = ranking;
    }
}

module.exports = Rank;
