//index.js

const app = getApp();
const util = require('../../utils/util');
const http = require('../../utils/http');
const constants = require('../../utils/constants');

Page({
    data: {
        showEnrollBtn: true,
        showExamBtn: false,
        showHistoryBtn: false
    },
    onLoad: function (option) {
        console.log('exam-deatail', option);
    }
});
