let Backbone = require("backbone");

module.exports = Backbone.Router.extend({
    // initialize: function () {},

    routes: {
        '': 'startGame',
        'start': 'startGame',
        'play': 'playGame',
        'end': 'endGame',
    },

});