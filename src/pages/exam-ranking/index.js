//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');
const User = require('../../model/user');
const Rank = require('../../model/rank');

let pageData = {
    activityId: '',

    noDataLabel: '',
    page: 1,
    limit: constants.LIMIT,
    rankList: [],
    myRank: null
};

Page({
    data: pageData,
    onLoad: function (option) {
        this.data.activityId = option.activityId;
        this.getUserRanking();
    },
    onPullDownRefresh: function () {
        this.setData({
            rankList: [],
            page: 1,
            noDataLabel: ''
        });
        this.getUserRanking();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, constants.PULL_DOWN_STOP_TIME);
    },
    onReachBottom: function () {
        this.setData({
            page: this.data.page + 1
        });
        this.getRankingList();
    },
    getUserRanking: function () {
        http.get(http.URL_FIND_USER_RANKING, {activityId: this.data.activityId}, (result) => {
            let user = new User(result.user);
            let rank = new Rank(user, result.score, result.ranking);
            this.setData({
                myRank: rank
            });
            this.getRankingList();
        });
    },
    getRankingList: function () {
        let params = {
            activityId: this.data.activityId,
            page: this.data.page,
            limit: this.data.limit
        };
        http.get(http.URL_FIND_RANKING_LIST, params, result => {
            if (result.numberOfElements > 0) {
                let rankList = this.data.rankList;
                for (let item of result.content) {
                    let user = new User(item.user);
                    let rank = new Rank(user, item.score, item.ranking);
                    rankList.push(rank);
                }
                let label = '';
                if (result.last) {
                    label = constants.NO_MORE_DATA_LABEL;
                }
                this.setData({
                    noDataLabel: label,
                    rankList: rankList
                });
            } else {
                let label = constants.NO_DATA_LABEL;
                if (this.data.rankList.length > 0) {
                    label = constants.NO_MORE_DATA_LABEL;
                }
                this.setData({
                    noDataLabel: label
                });
            }
        })
    }
});
