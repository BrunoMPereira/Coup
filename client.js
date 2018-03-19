function Client(socketID, nickname, hand, onTurn){
    this.socketID = socketID;
    this.nickname = nickname;
    this.hand = hand;
    this.onTurn = onTurn;
    this.coins = 2;
}



module.exports.Client = Client;