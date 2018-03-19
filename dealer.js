var deck = require('./deck.js')

function Dealer(){
    this.deck = new deck.Deck();
    this.deck.shuffle();
}

Dealer.prototype.randomStart = function(){
    return [this.deck.topCard(), this.deck.topCard()];
}


module.exports.Dealer = Dealer;