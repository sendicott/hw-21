let Backbone = require("backbone");

module.exports = Backbone.Router.extend({
    initialize: function () {
        console.log("checking");
    },

    routes: {
        'start': 'startGame',
        'play': 'playGame',
        'end': 'endGame',
    },

});