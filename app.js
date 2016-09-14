let Backbone = require("backbone");

// 1. Writing a model
let TaxiModel = Backbone.Model.extend({
    defaults: {
        username: "string",
        fuel: 8,
        score: 0,
        taxiPosition: [0, 0],
        passPosition: [Math.floor(Math.random() * 11), Math.floor(Math.random() * 11)],
    },

    move: function (x, y) {
        this.set('taxiPosition', [
            this.get('taxiPosition')[0] + x,
            this.get('taxiPosition')[1] + y,
        ]);
        this.set('fuel', this.get('fuel') - 1);
        this.set('score', this.get('score') + 1);

        // just trying this out, calm down people who study my
        // every decision on GitHub with these public repos
        if (this.get('taxiPosition')[0] === this.get('passPosition')[0]) {
            if (this.get('taxiPosition')[1] === this.get('passPosition')[1]) {
                console.log('woop!');
            }
        }
    },


});

// 2. Creating a view
let TaxiView = Backbone.View.extend({
    initialize: function() {        
        this.model.on('change', this.render, this);
    },

    events: {
        'click #up': 'update',
        'click #down': 'downdate',
        'click #left': 'leftdate',
        'click #right': 'rightdate',
    },

    update: function () {
        if (this.model.get('taxiPosition')[1] < 10) {
            console.log("up");
            this.model.move(0, 1);
        }
    },

    downdate: function () {
        if (this.model.get('taxiPosition')[1] > 0) {
            console.log("down");
            this.model.move(0, -1);
        }
    },

    leftdate: function () {
        if (this.model.get('taxiPosition')[0] > 0) {
            console.log("left");
            this.model.move(-1, 0);
        }
    },

    rightdate: function () {
        if (this.model.get('taxiPosition')[0] < 10) {
            console.log("right");
            this.model.move(1, 0);
        }
    },

    render: function () {
        document.querySelector('#taxiPosition').textContent = this.model.get('taxiPosition');
        document.querySelector('#fuelAmount').textContent = this.model.get('fuel');
        document.querySelector('#scoreBoard').textContent = this.model.get('score');
        document.querySelector('#passPosition').textContent = this.model.get('passPosition');
    }
});



window.addEventListener('load', function() {
    let actualModel = new TaxiModel();
    let view = new TaxiView({
        el: document.querySelector('#kitAndCaboodle'),
        model: actualModel,
    });
});