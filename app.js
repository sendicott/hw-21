let Backbone = require("backbone");

// 1. Writing a model
let TaxiModel = Backbone.Model.extend({
    defaults: {
        username: "string",
        fuel: 15,
        score: 0,
        taxiPosition: [0, 0],
        passPosition: [0, 0],
    },

    move: function (x, y) {
        this.set('taxiPosition', [
            this.get('taxiPosition')[0] + x,
            this.get('taxiPosition')[1] + y,
        ]);
        this.set('fuel', this.get('fuel') - 1);
        this.set('score', this.get('score') + 1);
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
    }
});



window.addEventListener('load', function() {
    let actualModel = new TaxiModel();
    let view = new TaxiView({
        el: document.querySelector('#kitAndCaboodle'),
        model: actualModel,
    });
});