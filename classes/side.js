class Side {
    name = ""
    cases = []
    cards = []
    pawns = []
    scope = 0
    currentPawn = null
    currentCard = null
    overClick = null

    onSevening = 0
    onMovingSevening = false
    onMovingFiving = false
    pawnImg = null

    pawnAnimation = 0
    pawnAnimationModif = 1

    constructor(color, board, human = false){
        this.board = board
        this.color = color
        this.name = color
        for (let i = 0; i < this.board.nbHorses; i++) {
            this.pawns.push(new Pawn(this))
        }
        this.currentPawn = this.pawns[0]
        this.human = human
        this.pawnImg = new Image();
        this.pawnImg.src = `./images/classic/${this.name}.svg`
    }

    updatePawnAnimation(){
        this.pawnAnimation = this.pawnAnimation + this.pawnAnimationModif
        if(this.pawnAnimation >= 20){
            this.pawnAnimationModif = -1
        } else if (this.pawnAnimation <= 0){
            this.pawnAnimationModif = 1
        }
    }
    draw(canvas){
        this.pawns.forEach(pawn => {
            pawn.draw(canvas)
        });
    }

    getPawns(){
        return (this.pawns.length > 0) ? this.pawns : this.team.pawns()
    }

    click(x,y){
        if(this.scope == 0){
            this.getPawns().forEach(pawn => {
                if(this.overClick && pawn.inside(x,y)) this.overClick(pawn);
                else if(pawn.inside(x,y)) this.currentPawn = pawn; this.displayCards(this.cards);
            });
        } else if (this.scope == 2) {
            this.board.sides.forEach(side => {
                side.getPawns().forEach(pawn => {
                    if(this.overClick && pawn.inside(x,y)) this.overClick(pawn);
                    else if(pawn.inside(x,y)) this.currentPawn = pawn;
                });
            });
        }
    }

    drawCards(){
        return new Promise((resolve, reject) =>{
            let url = `https://deckofcardsapi.com/api/deck/${this.board.deck.deck_id}/draw/?count=${this.board.nCards}`
            callApi(url, "json", null, (deck) => {
                this.cards = deck.cards
                this.setCards(deck.cards.map(card => card.code)).then((r)=>{
                    resolve(true)
                })
            })
        })
    }

    setCards(cards){
        return new Promise((resolve, reject) =>{
            callApi(`https://deckofcardsapi.com/api/deck/${this.board.deck.deck_id}/pile/${this.name}/add/?cards=${cards.join(",") }`,"json",null,(resp) => {
                
                resolve(resp)
            })
        })
    }

    getCards(){
        document.querySelector("#hand").innerHTML = ""
        return new Promise((resolve, reject) =>{
            let url = `https://deckofcardsapi.com/api/deck/${this.board.deck.deck_id}/pile/${this.name}/list`
            callApi(url, "json", null, (deck) => {
                resolve(deck.piles[this.name].cards)
            })
        })
    }

    showCards(){
        this.getCards().then(cards => {
            if(cards.length <= 0){
                this.board.round().then(res => {
                    this.getCards().then(cards => {
                        this.displayCards(cards)
                    })
                })
            } else {
                this.displayCards(cards)
            }
        })
    }

    displayCards(cards){
        if(!this.human){
            changeText(" ")
            if(this.board.allCardsGived()>0){
                return this.giveCard(this.computerGive(cards)).then((card) => {
                    if(this.board.allCardsGived()==0){
                        this.board.swapCards().then(r => {
                            this.board.nextPlayer()
                        })
                    } else {
                        this.board.nextPlayer()
                    }
                })
            } else {
                return this.computerPlay(cards).then(card => {
                    this.putCard(card).then(resp => {
                        let move = document.createElement("p")
                        move.innerHTML = `<img src='${this.pawnImg.src}'> L'équipe ${this.name} a joué ${cardsDefinitions[card.value]} de ${cardsDefinitions[card.suit]}`
                        document.querySelector("#moves").append(move)
                        this.board.nextPlayer();
                    }).catch(card => {
                        this.dropCard(card).then(res => {
                            let move = document.createElement("p")
                            move.innerHTML = `<img src='${this.pawnImg.src}'> L'équipe ${this.name} s'est défaussée d'${cardsDefinitions[card.value]} de ${cardsDefinitions[card.suit]}`
                            document.querySelector("#moves").append(move)
                            this.board.nextPlayer()
                        })
                    })
                }).catch(card => {
                    this.dropCard(card).then(res => {
                        let move = document.createElement("p")
                        move.innerHTML = `<img src='${this.pawnImg.src}'> L'équipe ${this.name} s'est défaussée d'${cardsDefinitions[card.value]} de ${cardsDefinitions[card.suit]}`
                        console.log(`<img src='${this.pawnImg.src}'> L'équipe ${this.name} s'est défaussée d'${cardsDefinitions[card.value]} de ${cardsDefinitions[card.suit]}`)
                        document.querySelector("#moves").append(move)

                        this.board.nextPlayer()
                    })
                })
            }
            
        }
        
        this.cards = cards
        this.board.putCard = true
        let container = document.querySelector("#hand");
        container.innerHTML = ""
        cards.forEach(card => {
            let img = document.createElement("img")
            img.src = card.image
            img.classList.add("card")
            if(this.board.allCardsGived()>0){
                changeText("Sélectionne une carte à donner à ton coéquipier !")
                img.classList.add("card--playable")
                img.addEventListener("mousedown",(e)=>{
                    this.giveCard(card).then((card) => {
                        if(this.board.allCardsGived()==0){
                            this.board.swapCards().then(r => {
                                this.board.nextPlayer()
                            })
                        } else {
                            this.board.nextPlayer()
                        }
                    })
                })
            } else {
                if(this.board.passTurn){
                    changeText("Pas de bol, le joueur précédent a joué un 10, défausse-toi !")
                } else {
                    changeText("Tu peux sélectionner un pion, puis jouer ou défausser une carte !")
                }
                img.classList.add( (this.isPlayableCard(card) ? "card--playable" : "card--unplayable") )
                img.addEventListener("mousedown",(e)=>{
                    if(e.button == 0){
                        if(this.isPlayableCard(card)){
                            this.putCard(card).then(resp => {
                                let move = document.createElement("p")
                                move.innerHTML = `<img src='${this.pawnImg.src}'> L'équipe ${this.name} a joué ${cardsDefinitions[card.value]} de ${cardsDefinitions[card.suit]}`
                                document.querySelector("#moves").append(move)

                                this.board.nextPlayer();
                            }).catch(card => {
                                this.dropCard(card).then(res => {
                                    let move = document.createElement("p")
                                    move.innerHTML = `<img src='${this.pawnImg.src}'> L'équipe ${this.name} s'est défaussée d'${cardsDefinitions[card.value]} de ${cardsDefinitions[card.suit]}`
                                    document.querySelector("#moves").append(move)

                                    this.board.nextPlayer()
                                })
                            })
                        }
                    } else if (e.button == 2){
                        this.dropCard(card).then(res => {
                            let move = document.createElement("p")
                            move.innerHTML = `<img src='${this.pawnImg.src}'> L'équipe ${this.name} s'est défaussée d'${cardsDefinitions[card.value]} de ${cardsDefinitions[card.suit]}`
                            document.querySelector("#moves").append(move)

                            this.board.nextPlayer()
                        })
                    }
                })
                img.addEventListener("mouseover",(e)=>{
                    this.currentCard = card
                    this.board.currentCase = this.previewCard()
                    document.querySelectorAll(".card--current").forEach(el => {
                        el.classList.remove("card--current")
                    });
                    img.classList.add("card--current")
                })
            }
            container.append(img)
        })
    }

    outPawns(){
        return this.getPawns().filter(p => p.case)
    }
    inPawns(){
        return this.getPawns().filter(p => !p.case)
    }
    onEntryPawn(){
        return this.getPawns().find(p => p.case == this.cases[this.cases.length-2])
    }
    homeStretchPawns(){
        return this.getPawns().filter(p =>  p.case && p.howManyCaseforEnd() <= 13 && p.howManyCaseforEnd() > 0)
    }
    notHomeStretchPawns(){
        return this.getPawns().filter(p =>  p.case && p.howManyCaseforEnd() > 13 && p.howManyCaseforEnd() < 56)
    }


    isPlayableCard(card){
        if(this.board.passTurn) return false;
        switch (card.value) {
            case "ACE":
                return true
                break;
            case "KING":
                return true
                break;
            case "JACK":
                let isOtherPawnSorted = false
                this.board.sides.forEach(side => {
                    if(side != this && side.outPawns().length > 0) isOtherPawnSorted = true
                });
                return (this.currentPawn.case && isOtherPawnSorted) ? true : false
                break;
            case "5":
                let out = 0
                this.board.sides.forEach(side => {
                    out += side.outPawns().length
                })
                return out > 0;
                break;
            case "4":
                return (this.currentPawn.case && this.cases.indexOf(this.currentPawn.case) <  this.cases.length - 5) ? true : false
                break;
            default:
                return (this.currentPawn.case) ? true : false
                break;
        }
    }

    previewCard(){
        switch(this.currentCard.value){
            case "ACE":
                if(this.currentPawn.case){
                    return this.currentPawn.getFinalCase(1)
                } else {
                    return this.cases[this.cases.length-2]
                }    
                break;
            case "KING":
                if(this.currentPawn.case){
                    return this.currentPawn.getFinalCase(13)
                } else {
                    return this.cases[this.cases.length-2]
                }   
                break;
            case "QUEEN":
                return this.currentPawn.getFinalCase(12) 
                break;
            case "JACK":
                return false
                break;
            case "7": 
                return false
                break;
            case "5": 
                return false
                break;
            case "4": 
                if(this.cases.indexOf(this.currentPawn.case) <  this.cases.length - 5){
                    this.currentPawn.getFinalCase(-4) 
                }
                break;
            default: 
                return this.currentPawn.getFinalCase(this.currentCard.value) 
                break;
        }
    }

    dropCard(card){
        return new Promise((resolve, reject) => {
            let url = `https://deckofcardsapi.com/api/deck/${this.board.deck.deck_id}/pile/${this.name}/return/?cards=${card.code}`
            callApi(url, "json", null, (data) => {        
                this.board.passTurn = (card.value == "10") ? true : false;
                resolve(true)
            })
        })
    }

    savePawn(pawn){
        this.board.pause()
        return new Promise((resolve, reject) => {
            pawn.side.pawns.splice(pawn.side.pawns.indexOf(pawn), 1);
            congratulations(`L'équipe ${this.name} a sauvé un pion !`, 1000, () => {
                if(this.team.pawnsAlive()==0){
                    this.board.win(this.team)
                } else {
                    this.board.play()
                    resolve(true)  
                }  
            })
            
        })
    }

    putCard(card){
        return new Promise((resolve, reject) => {
            if(this.board.putCard == false) reject(card);
            let url = `https://deckofcardsapi.com/api/deck/${this.board.deck.deck_id}/pile/${this.name}/return/?cards=${card.code}`
            callApi(url, "json", null, data => {
                switch (card.value) {
                    case "ACE":
                        if(this.currentPawn.case && this.currentPawn.case == this.cases[this.cases.length-1]){
                            this.savePawn(this.currentPawn).then(r => {
                                resolve(true)
                            })
                        } else if(this.currentPawn.case){
                            this.currentPawn.move(1).then(resp => { resolve(true) }).catch(card => reject(card))
                        } else {
                            this.currentPawn.moveTo(this.cases[this.cases.length-2]).then(resp => resolve(true)).catch(card => reject(card))
                        }
                        break;
                    case "KING":
                        if(this.currentPawn.case && this.currentPawn.case == this.cases[this.cases.length-1]){
                            this.savePawn(this.currentPawn).then(r => {
                                resolve(true)
                            })
                        } else if(this.currentPawn.case){
                            this.currentPawn.move(13).then(resp => resolve(true)).catch(card => reject(card))
                        } else {
                            this.currentPawn.moveTo(this.cases[this.cases.length-2]).then(resp => resolve(true)).catch(card => reject(card))
                        }
                        break;
                    case "QUEEN":
                        this.currentPawn.move(12).then(resp => resolve(true)).catch(card => reject(card))
                        break;
                    case "JACK":
                        this.scope = 2
                        changeText("Clique sur un pion échanger de place avec lui")
                        this.overClick = this.jacking
                        break;
                    case "4":
                        if(this.cases.indexOf(this.currentPawn.case) <  this.cases.length - 5){
                            this.currentPawn.move(-4).then(resp => { resolve(true) }).catch(card => reject(card))
                        } else {
                            reject(card)
                        }
                        break;
                    case "5":
                        this.scope = 2
                        this.onMovingSevening = false
                        changeText("Clique sur n'importe quel pion sorti pour le faire avancer")
                        this.overClick = this.fiving
                        break;
                    case "7":
                        this.onMovingSevening = false
                        this.onSevening = 7
                        changeText("Clique sur un pion pour le faire avancer (7 cases restantes)")
                        this.overClick = this.sevening
                        break;
                    case "10":
                        this.board.passTurn = true
                        this.currentPawn.move(10).then(resp => { resolve(true) }).catch(card => reject(card))
                    break;
                    default:
                        this.currentPawn.move(card.value).then(resp => { resolve(true) }).catch(card => reject(card))
                        break;
                }
            })
        })
    }

    fiving(pawn){
        if(this.onMovingFiving == true) return false;
        this.onMovingFiving = true
        if(pawn.getFinalCase(5)){
            pawn.move(5).then(resp => {
                this.scope = 0
                this.overClick = null
                changeText(` `)
                this.board.nextPlayer()
            })
        }
    }
    sevening(pawn){
        if(this.onMovingSevening == true) return false;
        this.onMovingSevening = true
        if(pawn.getFinalCase(1)){
            pawn.move(1).then(resp => {
                if(this.onSevening <= 1){
                    this.overClick = null
                    changeText(` `)
                    this.board.nextPlayer()
                } else {
                    this.onSevening -= 1
                    changeText(`Clique sur un pion pour le faire avancer (${this.onSevening} case${(this.onSevening > 1 ? "s" : "")} restante${(this.onSevening > 1 ? "s" : "")})`)
                    this.onMovingSevening = false
                }
            })
        }
    }

    jacking(pawn){
        if(pawn.case){
            this.overClick = null
            this.scope = 0
            let c1 = this.currentPawn.case
            let c2 = pawn.case
            pawn.setCase(c1)
            this.currentPawn.setCase(c2)
            changeText(` `)
            this.board.nextPlayer()
        }
    }

    giveCard(card){
        return new Promise((resolve,reject) => {
            this.givingCard = card.code
            resolve(true)
        })
    }

    getAllyCard(){
        return new Promise((resolve, reject) => {
            let index = this.team.sides.findIndex(s => s != this)
            this.setCards([this.team.sides[index].givingCard]).then(res => {
                resolve(true)
            })
        })
    }

    computerDiscard(cards){
        return cards[Math.floor(Math.random()*cards.length)];
    }

    computerGive(cards){
        return cards[Math.floor(Math.random()*cards.length)];
    }

    computerPlay(cards){
        return new Promise((resolve,reject) => {
            let comportment = new Comportment(this, cards)
            comportment.calc().then(card => {
                console.log("PLAY", card)
                resolve(card)
            }).catch(err => {
                console.log("DISCARD", err)
                reject(this.computerDiscard(cards))
            })
        })
    }   
}