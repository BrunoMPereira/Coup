/*
    TODO: Classe Player
                hand
                turn
                coins
                nick
    Upgrade to use JQUERY       
    Centralizar atualização das coins         
*/

var socket = io();

var deck = [];
var hand = [];
var myTurn = false;
var coins = 2;
var nick;


function newPlayer() {
    nick = prompt("NICKNAME: ", "");
    socket.emit('new player', nick);
    updateCoins();
}

setInterval(updateCoins, 1500);

function updateCoins() {
    document.getElementById("coins").textContent = "Coins: " + coins;
}

socket.on('hand', function (player) {
    //console.log(player.hand.role);
    var images_div = document.getElementById("hand_images");

    if (!hand[0]) {
        var img = document.createElement("img");
        img.src = player.hand[0].image;
        images_div.appendChild(img);

        hand[0] = player.hand[0].role;
    }
    if (!hand[1]) {
        var img = document.createElement("img");
        img.src = player.hand[1].image;
        images_div.appendChild(img);

        hand[1] = player.hand[1].role;
    }

    $("#my_hand").html(hand[0] + "<br>" + hand[1]);

    //console.log(player);
});

socket.on('deck state', function (deck_fs) {
    deck = deck_fs;

    /*var str = "";
    document.getElementById("deck").innerHTML = "";
    deck_fs.cards.forEach(card => {
        document.getElementById("deck").innerHTML += card.role + "<br>";
    });
    */

    document.getElementById("cards-left").textContent = deck.cards.length + " cards left"
});


socket.on('give turn', function () {
    myTurn = true;
})

socket.on('turn update', function () {
    if (myTurn)
        document.getElementById("turn-label").style.display = "inline-block";
    else
        document.getElementById("turn-label").style.display = "none";
})


socket.on('players-connected update', function (players) {
    //Melhorar
    var playersDiv = document.getElementById("players-connected");
    clearChildNodes(playersDiv);

    players.forEach(function (player) {
        var playerDiv = document.createElement("span");
        if (player.onTurn)
            playerDiv.textContent = player.nickname + " - " + player.coins + " coins (TURN)";
        else
            playerDiv.textContent = player.nickname + " - " + player.coins + " coins";

        playersDiv.appendChild(playerDiv);
    })

})


socket.on('play intention', function(play){
    showPlayIntention(play);
})

function showPlayIntention(play){
    var playIntentionLabel = document.getElementById("play-intention-label");

    playIntentionLabel.textContent = play.player.nickname + " wants to " + play.play;;
    $("#play").fadeIn(150);
}

function clearChildNodes(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function nextTurn() {
    if (myTurn) {
        myTurn = false;
        socket.emit('next turn');
    }
}

function oneCoin() {
    if (myTurn) {
        myTurn = false;
        coins++;
        updateCoins
        socket.emit('play', 'take one coin');
    }
}

function twoCoins() {
    if(myTurn){
        socket.emit('play', 'take two coins');
    }
    
}

function shuffleDeck() {
    socket.emit('shuffle');
}

function resetDeck() {
    socket.emit('reset deck');

}

function challengePlay(){
    $("#play").fadeOut(150);
}

function allowPlay(){
    $("#play").fadeOut(150);
}


/*
    CHAT
*/
function sendChatMessage() {
    var messsage = document.getElementById("message");

    if (message.value) {
        socket.emit('send new message', message.value);
        message.value = "";
    }
}


socket.on('new message', function (data) {
    var message = document.createElement("span");
    message.className = "chat-message";
    console.log(data);
    message.textContent = data;


    document.getElementById("chat-messages-container").appendChild(message);
});

$(document).ready(function () {
    $('#submit-message-form').submit(function () {
        sendChatMessage();
        return false;
    });
});