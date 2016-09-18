let Backbone = require("backbone");

module.exports = Backbone.Router.extend({
    initialize: function () {
        console.log("checking");
    },

    routes: {
        '': 'startGame',
        'start': 'startGame',
        'play': 'playGame',
        'end': 'endGame',
    },

});