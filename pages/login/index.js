//index.js
const app = getApp();
let util = require('../../utils/util');
let http = require('../../utils/http')

Page({
    data: {
    },
    onLoad: function() {
        console.log('login');
    },
    formSubmit: function (event) {
        console.log('submit', event);
        http.get(http.URL_LOGIN, event.detail.value, data => {
            console.log(data);
        })
    },

    goToRegistration: function() {
        console.log('registration');
    }
});
