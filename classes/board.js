
class Board {
    deck = null
    canvas = null
    vectors = [
        [6,0],
        [0,6],
        [2,0],
        [0,-6],
        [6,0],
        [0,-2]
    ]
    
    cases = [];
    nCards = 5;
    currentRound = 0
    currentCase = null
    putCard = true;
    passTurn = false;
    histoTurn = []
    
    end = false
    interval = null

    x = 0
    y = 0

    nRound = 0
    playing = false;
    nextTurnRequired = false;

    constructor(canvas, withplayer, nbHorses) {
        this.nbHorses = nbHorses
        this.sides = [new Side("red", this, withplayer), new Side("yellow", this, false), new Side("green", this, false), new Side("blue", this, false)]
    
        this.currentSide = this.sides[0];
        this.teams = [new Team([this.sides[0],this.sides[2]]), new Team([this.sides[1],this.sides[3]])]
        
        this.canvas = canvas
        this.canvas.width = 800
        this.canvas.height = 450
        this.canvas.addEventListener("click", (evt) => {
            let rect = canvas.getBoundingClientRect();
            this.currentSide.click(evt.clientX - rect.left, evt.clientY - rect.top)
        })
        this.generateCases().then(resp => {
            this.draw()
            this.playing = true
            this.round().then(resp => {
                this.showCurrentCards()
            })
            this.interval = setInterval(() => {
                this.draw()
            }, 100);
        })
        document.querySelectorAll(".fabgame").forEach((fab)=>{
            fab.style.display = "flex"
        })
        if(withplayer==0)document.querySelector("#title").style.visibility = "hidden"
    }


    pause(){
        console.log("PAUSE")
        this.playing = false;
    }

    play(){
        this.playing = true
        if(this.nextTurnRequired) this.nextPlayer()
    }

    draw(){
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height); 
        this.cases.forEach(cas => {
            cas.draw(this.canvas, (this.currentCase == cas) ? true : false)
        });
        this.sides.forEach(side => {
            side.draw(this.canvas)
        })
    }
    
    addCase(x, y, side){
        this.cases.push(new Case(x, y, side))
    }

    generateCases(){
        return new Promise((resolve, reject) => {
            pattern.forEach((point) => {
                this.addCase(point.x,point.y,this.sides[parseInt(point.side)])
            });
            resolve(true)
        })
    }

    round(){
        this.sides.forEach(side => {
            side.givingCard = null
        })
        this.currentRound = (this.currentRound >= 4) ? 1 : this.currentRound + 1;
        this.nCards = (this.currentRound == 4 || this.currentRound == 1) ? 5 : 4
        return new Promise((resolve,reject) => {
            this.generateDeck().then((deck) => {
                this.drawAllCards().then(resp => {
                    this.nRound++
                    let round = document.createElement("p")
                    round.classList.add("round")
                    round.innerHTML = `${this.nRound + (this.nRound == 1 ? "ère" : "ème")} distribution`
                    document.querySelector("#moves").append(round)
                    resolve(true)
                })
            })
        })
    }

    drawAllCards(){
        return new Promise((resolve,reject) => {
            this.drawCards(0).then(res => {
                this.drawCards(1).then(res => {
                    this.drawCards(2).then(res => {
                        this.drawCards(3).then(res => {
                            resolve(true)
                        })
                    })
                })
            })
        })
    }
    
    drawCards(i){
        return new Promise((resolve,reject) => {
            this.sides[i].drawCards().then(res => {
                resolve(true)
            })
        })
    }

    generateDeck(){
        return new Promise((resolve,reject)=>{
            if(this.deck){
                this.shuffleDeck().then(deck =>{
                    resolve(deck)
                })
            } else {
                callApi("https://deckofcardsapi.com/api/deck/new/shuffle/","json",null,(deck) => {
                    this.deck = deck
                    resolve(deck)
                })
            }
        })
    }

    shuffleDeck(){
        return new Promise((resolve, reject) => {
            callApi(`https://deckofcardsapi.com/api/deck/${this.deck.deck_id}/shuffle/`,"json",null,(deck) => {
                this.deck = deck
                resolve(deck)
            })
        })
    }

    showCurrentCards(){
        this.currentSide.showCards();
    }

    allCardsGived(){
        let r = 0
        this.sides.forEach(side => {
            if(!side.givingCard) r++
        });
        return r;
    }

    nextPlayer(){
        if(this.end) return
        if(!this.playing) return this.nextTurnRequired = true;
        this.currentCase = null
        let currentIndex = this.sides.findIndex(s => s == this.currentSide) + 1
        this.currentSide = (currentIndex >= this.sides.length) ? this.sides[0] : this.sides[currentIndex]
        this.currentSide.getCards().then(cards => {
            if(cards.length == 0){
                this.round().then(resp => {
                    this.currentSide.showCards()
                })
            } else {
                this.currentSide.displayCards(cards)
            }
        })
    }

    swapCards(){
        return new Promise((resolve, reject) => {
            this.sides[0].getAllyCard().then(res => {
                this.sides[1].getAllyCard().then(res => {
                    this.sides[2].getAllyCard().then(res => {
                        this.sides[3].getAllyCard().then(res => {
                            resolve(true)
                        })
                    })
                })
            })
        })
    }

    win(team){
        this.end = true
        document.querySelectorAll(".fabgame").forEach((fab)=>{
            fab.style.display = "none"
        })
        document.querySelector("#title").style.visibility = "visible"
        document.querySelector("#title").innerHTML = ""
        document.querySelector("#board").style.display = "none"
        document.querySelector("#won p").innerHTML = `L'équipe ${team.sides[0].name} & ${team.sides[1].name} l'emporte !`
        document.querySelector("#won").style.display = "block"
        setTimeout(() => {
            document.querySelector("#won button").style.display = "block"
        }, 4000);
    }
}