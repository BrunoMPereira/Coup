var card = require('./card.js');

var roles = ["DUKE","ASSASSIN","AMBASSADOR","CAPTAIN","CONTESSA"]

function Deck(){
    this.cards = [];
    for(var i=0; i < 5; i++){
        this.cards.push(new card.Card("DUKE", "/static/coup_cards/carta_27.png"));
        this.cards.push(new card.Card("ASSASSIN", "/static/coup_cards/carta_39.png"));
        this.cards.push(new card.Card("AMBASSADOR", "/static/coup_cards/carta_36.png"));
        this.cards.push(new card.Card("CAPTAIN", "/static/coup_cards/carta_38.png"));
        this.cards.push(new card.Card("CONTESSA", "/static/coup_cards/carta_37.png"));
    }
}

Deck.prototype.shuffle = function(){
    return this.cards.sort(function(){return 0.5 - Math.random()});
}
Deck.prototype.topCard = function(){
    return this.cards.pop();
}

function randomRole(){
    return roles[Math.floor(Math.random()*roles.length)]
}


module.exports.Deck = Deck;
module.exports.roles = roles;
module.exports.randomRole = randomRole;