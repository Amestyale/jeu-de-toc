class Comportment {
    side = null
    cards = []

    constructor(side, cards) {
        this.side = side
        this.cards = cards
    }

    getValue(card, preserveOut = true){
        switch (card.value) {
            case "ACE":
                return (preserveOut) ? -20  : 1
                break;
            case "KING":
                return (preserveOut) ? -21  : 13
                break;
            case "QUEEN":
                return 12
                break;
            case "JACK":
                return -100
                break;
            case "7":
                return -100
            case "4":
                return -4
                break;
            default:
                return card.value
                break;
        }
    }

    hasValues(values){
        return this.cards.filter(c => values.includes(c.value)).length > 0
    }

    findValue(value){
        return this.cards.find(c => c == value)
    }

    sortByValue(preserveOut = true){
        this.cards.sort((a,b)=>{
            return this.getValue(a, preserveOut) - this.getValue(b, preserveOut)
        })
        return this
    }

    filterByValues(values){
        let c = this.cards.filter((c) => values.includes(c.value) == true)
        this.cards = c
        return this
    }
    filterByValues2(values){
        let c = []
        this.cards.forEach(card => {
            if(values.indexOf(card.value)>=0) c.push(card);
        });
        this.cards = c
    }

    filterByPlayable(){
        this.cards = this.cards.filter(c => this.side.isPlayableCard(c) )
        return this
    }
    
    hightValue(among = [], preserveOut = true){
        return new Promise((resolve, reject) => {
            let cards = (among.length > 0) ? this.cards.filter(card => among.includes(card.value)) : this.cards 
            cards.sort((a,b)=>{
                return this.getValue(a, preserveOut) - this.getValue(b, preserveOut)
            })
            if(cards.length > 0){
                resolve(cards[0])
            } else {
                reject(this.cards[0])
            }
        })
    }

    optionsAvailables(howManyCases){
        let max;
        switch(howManyCases){
            case "1":
                max = "ACE"
                break;
            case "5":
            case "4":
                max = "3"
                break;
            case "7":
                max = "6"
                break;
            case "11":
                max = "10"
                break;
            case "12":
                max = "QUEEN"
                break;
            default:
                max = howManyCases
                break;
        }
        let options = ["ACE","2","3","6","8","9","10","QUEEN","KING"];
        let optim = []
        for (let i = 0; i < options.length; i++) {
            optim.push(options[i])
            if(options[i]==max) break
        }
        return optim
    }

    calc(){
        return new Promise((resolve, reject) => {
            this.trySave()
            .then(card => resolve(card) )
            .catch(b => {
                this.tryLastCases()
                .then(card => resolve(card) )
                .catch(b => {
                    if(this.side.outPawns().length > 0){
                        if(this.side.inPawns().length > 0){
                            this.tryOut()
                            .then(card => resolve(card))
                            .catch(e => {
                                if (this.side.notHomeStretchPawns().length > 0) {
                                    this.tryMove()
                                    .then(card => resolve(card))
                                    .catch(e => reject(false))
                                } else {
                                    reject(false)
                                }
                            })
                        } else if (this.side.notHomeStretchPawns().length > 0) {
                            this.tryMove()
                            .then(card => resolve(card))
                            .catch(e => reject(false))
                        } else {
                            reject(false)
                        }
                    } else {
                        this.tryOut()
                        .then(card => resolve(card))
                        .catch(e => reject(false))
                    }
                })
            })
            
            
        })
    }

    trySave(){
        return new Promise((resolve, reject) => {
            if(this.hasValues(["KING","ACE"])){
                if(this.side.outPawns().length == 0) reject(false)
                this.side.outPawns().forEach((pawn,i,arr) => {
                    if(pawn.case == this.side.cases[this.side.cases.length-1]){
                        this.hightValue(["KING","ACE"]).then(card=>{
                            resolve(card)
                        })
                    } else if (i == arr.length-1){
                        reject(false)
                    }
                });
            } else {
                reject(false)
            }
        })
    }

    tryLastCases(){
        return new Promise((resolve, reject) => {
            if(this.side.homeStretchPawns().length == 0) reject(false)
            this.side.homeStretchPawns().forEach((pawn,i,arr) => {
                let options = this.optionsAvailables(pawn.howManyCaseforEnd().toString())
                if(this.hasValues(options)){
                    // alert("DERNIERE LIGNE DROITE " + this.side.name)
                    this.side.currentPawn = pawn;
                    this.hightValue(options).then(card=>{
                        resolve(card)
                    })
                }  else if (i == arr.length-1){
                    reject(false)
                }
            });
        })
    }

    tryOut(){
        return new Promise((resolve, reject) => {
            if(!this.side.onEntryPawn() && this.hasValues(["KING","ACE"]) ){
                this.side.currentPawn = this.side.inPawns()[0]
                this.hightValue(["KING","ACE"]).then(card=>{
                    resolve(card)
                })
            } else {
                reject(false)
            }
        })
    }

    tryMove(){
        return new Promise((resolve, reject) => {
            this.side.currentPawn = (this.side.onEntryPawn()) ? this.side.onEntryPawn() : this.side.notHomeStretchPawns()[0]
            this.hightValue().then(card=>{
                if(!["JACK","7","5"].includes(card.value)) resolve(card)
                else reject(false)
            })
        })
    }


    targetForTheJack(){
        let thisI = this.side.board.cases.findIndex(c => c == this.side.currentPawn.case)
        let finalI = this.side.board.cases.findIndex(c => c == this.side.cases[this.side.cases.length-1])
        let diff = Math.abs((finalI-thisI)%56)
        let pawn = this.side.currentPawn
        this.side.board.cases.forEach( (c,i,arr) => {
            if(c.pawn && c.pawn.side != this.side){
                if( Math.abs((finalI-i)%56) < diff ){
                    diff = Math.abs((finalI-i)%56)
                    pawn = c.pawn
                }
            }
        });
        return pawn
    }

}