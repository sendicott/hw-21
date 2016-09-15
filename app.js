let Backbone = require("backbone");
let TaxiRouter = require('./router');

// Writing the model
let TaxiModel = Backbone.Model.extend({
    defaults: {
        username: "string",
        fuel: 10,
        score: 0,
        fuelCost: 1,
        moveGap: 1,     // set based on your car
        currentGap: 0,  // steps since you last picked someone up
        taxiPosition: [0, 0],
        passPosition: [Math.floor(Math.random() * 11), Math.floor(Math.random() * 11)],
    },

    move: function (x, y) {
        this.set('taxiPosition', [
            this.get('taxiPosition')[0] + x,
            this.get('taxiPosition')[1] + y,
        ]);

        this.set('fuel', this.get('fuel') - this.get('fuelCost'));
        this.set('score', this.get('score') + 1);
        this.set('currentGap', this.get('currentGap') + 1);

        if (this.get('taxiPosition')[0] === this.get('passPosition')[0]) {
            if (this.get('taxiPosition')[1] === this.get('passPosition')[1]) {
                if (this.get('currentGap') >= this.get('moveGap')) {
                    this.set('fuel', this.get('fuel') + 10);
                    this.set('passPosition', [
                        Math.floor(Math.random() * 11),
                        Math.floor(Math.random() * 11),
                    ]);
                    console.log(this.get('currentGap'));
                    this.set('currentGap', 0);
                    console.log(this.get('currentGap'));
                }
            }
        }


        if (this.get('fuel') <= 0) {
            console.log("Lose lose lose. Score: " + this.get('score'));

            // just trying
            this.trigger('finalScreen');
        }
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
        this.model.move(Math.floor(Math.random() * 11), Math.floor(Math.random() * 11));
        if (document.getElementById('easyDiff').checked) {
            this.model.set('fuel', this.model.get('fuel') + 11);
        } else if (document.getElementById('mediumDiff').checked) {
            this.model.set('fuel', this.model.get('fuel') + 1);
        } else if (document.getElementById('hardDiff').checked) {
            this.model.set('fuel', this.model.get('fuel') - 4);
        }

        if (document.querySelector('#sedan').checked) {
            this.model.set('fuelCost', 1);
            this.model.set('moveGap', 5);
        } else if (document.querySelector('#suv').checked) {
            this.model.set('fuelCost', 2);
            this.model.set('moveGap', 1);
        }

        this.trigger('go');
    },
});

// Creating the playGame view
let playGame = Backbone.View.extend({
    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
    },

    events: {
        // 'click #userBtn': 'begin',
        'click #up': 'update',
        'click #down': 'downdate',
        'click #left': 'leftdate',
        'click #right': 'rightdate',
    },

    // begin: function () {
    //     this.model.move(Math.floor(Math.random() * 11), Math.floor(Math.random() * 11));
    // },

    update: function () {
        if (this.model.get('taxiPosition')[1] < 10) {
            this.model.move(0, 1);
        }
    },

    downdate: function () {
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
        if (this.model.get('taxiPosition')[0] < 10) {
            this.model.move(1, 0);
        }
    },

    render: function () {
        document.querySelector('#taxiPosition').textContent = ("You are here: " + this.model.get('taxiPosition'));
        document.querySelector('#fuelAmount').textContent = ("Fuel left: " + this.model.get('fuel'));
        document.querySelector('#scoreBoard').textContent = ("Score: " + this.model.get('score'));
        document.querySelector('#passPosition').textContent = ("Next passenger: " + this.model.get('passPosition'));
    }
});

let endGame = Backbone.View.extend({

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
        router.navigate('play', {trigger: true});
    });

    actualModel.on('finalScreen', function () {
        console.log("testingfinal");
        router.navigate('end', {trigger: true});
    });

    router.on('route:startGame', function () {
        startView.el.classList.remove('hidden');
        playView.el.classList.add('hidden');
        endView.el.classList.add('hidden');
        console.log('starting');
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