/**
 * I just added a reset function in the model, now I need to add
 * a reset function that sets checks and inputs back to zero in 
 * the start view. 
 * 
 * After that, I need to send the view back to the start view
 * 
 * After that, I need to run a for loop that displays each high score
 * (ideally with its username) in an ordered list
 */

let Backbone = require("backbone");
let TaxiRouter = require('./router');

const GRID_SIZE = 10;

// Writing the model
let TaxiModel = Backbone.Model.extend({
    initialize: function () {
        this.reset();
    },

    defaults: {
        username: "string",
        vehicle: "string",
        fuel: 0,
        fuelCost: 1,
        score: 0,
        moveGap: 1,     // set based on your car
        currentGap: 0,  // steps since you last picked someone up
        taxiPosition: [0, 0],
        passPosition: [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)],
        highScores: [],
    },

    passCell: function() {
        return this.get('passPosition')[1] * 10 + this.get('passPosition')[0];
    },

    taxiCell: function() {
        return this.get('taxiPosition')[1] * 10 + this.get('taxiPosition')[0];
    },

    move: function (x, y) {
        this.set('taxiPosition', [
            this.get('taxiPosition')[0] + x,
            this.get('taxiPosition')[1] + y,
        ]);

        this.set('fuel', this.get('fuel') - this.get('fuelCost'));
        this.set('score', this.get('score') + 1);
        this.set('currentGap', this.get('currentGap') + 1);
        this.set('username', document.querySelector('#nameOfUser').value);

        if (this.get('taxiPosition')[0] === this.get('passPosition')[0]) {
            if (this.get('taxiPosition')[1] === this.get('passPosition')[1]) {
                if (this.get('currentGap') >= this.get('moveGap')) {
                    this.set('fuel', this.get('fuel') + 10);
                    this.set('passPosition', [
                        Math.floor(Math.random() * GRID_SIZE),
                        Math.floor(Math.random() * GRID_SIZE),
                    ]);
                    console.log(this.get('currentGap'));
                    this.set('currentGap', 0);
                    console.log(this.get('currentGap'));
                }
            }
        }

        if (this.get('fuel') <= 0) {
            this.trigger('finalScreen');
        }
    },

    reset: function() {
        this.set('username', "");
        this.set('vehicle', "");
        this.set('fuel', 10);
        this.set('fuelCost', 1);
        this.set('score', 0);
        this.set('moveGap', 1);
        this.set('currentGap', 0);
        this.set('taxiPosition', [0, 0]);
        this.set('passPosition', [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]);
    },
});

// Creating the startGame view
let startGame = Backbone.View.extend({
    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
    },

    events: {
        'click #userBtn': 'begin',
    },

    begin: function () {
        this.model.move(Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE));
        if (document.getElementById('easyDiff').checked) {
            this.model.set('fuel', this.model.get('fuel') + 11);
        } else if (document.getElementById('mediumDiff').checked) {
            this.model.set('fuel', this.model.get('fuel') + 6);
        } else if (document.getElementById('hardDiff').checked) {
            this.model.set('fuel', this.model.get('fuel') + 1);
        }

        if (document.querySelector('#sedan').checked) {
            this.model.set('fuelCost', 1);
            this.model.set('moveGap', 5);
            this.model.set('vehicle', "Volkswagen Jetta");
        } else if (document.querySelector('#suv').checked) {
            this.model.set('fuelCost', 2);
            this.model.set('moveGap', 1);
            this.model.set('vehicle', "Honda Pilot");
        }

        this.trigger('go');
    },
});

// Creating the playGame view
let playGame = Backbone.View.extend({
    initialize: function () {
        for (let i = 0; i < 10; i++) {
            let row = document.createElement('div'); 
            row.classList.add('row');
            document.querySelector('#grid').appendChild(row);

            for (let j = 0; j < 10; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                row.appendChild(cell);
            }
        }

        this.model.on('change', this.render, this);
        this.render();
    },

    // just switched up and down so it matches what it looks like on the screen, but numbers are now upside down
    events: {
        'click #up': 'update',
        'click #down': 'downdate',
        'click #left': 'leftdate',
        'click #right': 'rightdate',
    },

    downdate: function () {
        if (this.model.get('taxiPosition')[1] < 9) {
            this.model.move(0, 1);
        }
    },

    update: function () {
        if (this.model.get('taxiPosition')[1] > 0) {
            this.model.move(0, -1);
        }
    },

    leftdate: function () {
        if (this.model.get('taxiPosition')[0] > 0) {
            this.model.move(-1, 0);
        }
    },

    rightdate: function () {
        if (this.model.get('taxiPosition')[0] < 9) {
            this.model.move(1, 0);
        }
    },

    render: function () {
        let passenger = document.querySelector('.currentPass');
        if (passenger !== null) {
            passenger.classList.remove('currentPass');
        }

        let taxi = document.querySelector('.currentTaxi');
        if (taxi !== null) {
            taxi.classList.remove('currentTaxi');
        }

        let cells = document.querySelectorAll('.cell');
        cells[this.model.passCell()].classList.add('currentPass');
        cells[this.model.taxiCell()].classList.add('currentTaxi');

        document.querySelector('#currentUN').textContent = this.model.get('username');
        document.querySelector('#currentVehicle').textContent = "Vehicle: " + this.model.get('vehicle');
        // document.querySelector('#taxiPosition').textContent = ("You are here: " + this.model.get('taxiPosition'));
        document.querySelector('#fuelAmount').textContent = ("Fuel left: " + this.model.get('fuel'));
        document.querySelector('#scoreBoard').textContent = ("Score: " + this.model.get('score'));
        // document.querySelector('#passPosition').textContent = ("Next passenger: " + this.model.get('passPosition'));
    },
});

let endGame = Backbone.View.extend({
    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
    },

    events: {
        'click #restart': 'startOver',
    },

    startOver: function () {
        this.trigger('reset');
    },

    render: function () {
        document.querySelector('#finalUser').textContent = this.model.get('username') + "...";
        document.querySelector('#finalScore').textContent = ("FINAL SCORE: " + this.model.get('score'));
    },
});

// adding a window event listener
window.addEventListener('load', function () {
    let actualModel = new TaxiModel();

    let startView = new startGame({
        el: document.querySelector('#startGame'),
        model: actualModel,
    });

    let playView = new playGame({
        el: document.querySelector('#playGame'),
        model: actualModel,
    });

    let endView = new endGame({
        el: document.querySelector('#endGame'),
        model: actualModel,
    });

    let router = new TaxiRouter();

    startView.on('go', function () {
        router.navigate('play', { trigger: true });
    });

    // When the endView triggers a 'reset' event
    endView.on('reset', function () {
        // Reset the model
        startView.reset(); // we need to make this
        actualModel.reset(); // we need to make this 

        // Re-route to start
        router.navigate('start', { trigger: true });
    });

    actualModel.on('finalScreen', function () {

        let highscores = actualModel.get('highScores');
        highscores.push(actualModel.get('score'));
        actualModel.set('highScores', highscores);
        console.log("High Score List: " + highscores);

        document.querySelector('#highScoreList').innerHTML = ("<li>" + actualModel.get('username') + highscores + "</li>");

        router.navigate('end', { trigger: true });
    });

    router.on('route:startGame', function () {
        startView.el.classList.remove('hidden');
        playView.el.classList.add('hidden');
        endView.el.classList.add('hidden');
    });

    router.on('route:playGame', function () {
        startView.el.classList.add('hidden');
        playView.el.classList.remove('hidden');
        endView.el.classList.add('hidden');
    });

    router.on('route:endGame', function () {
        startView.el.classList.add('hidden');
        playView.el.classList.add('hidden');
        endView.el.classList.remove('hidden');
    });

    Backbone.history.start();
});