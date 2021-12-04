class Pawn {
    case = null
    side = null
    x = null
    y = null

    constructor(side){
        this.side = side
    }

    setCase(c = null){
        if(this.case) this.case.pawn = null
        if(c){
            if(c.pawn){
                c.pawn.case = null
                c.pawn = null
            }
            c.pawn = this 
        }
        this.case = c
    }

    inside(x,y){
        return (x >= this.x-17.5 && x <= this.x-17.5+35 && y >= this.y - 55 &&  y <= this.y - 55 + 50) ? true : false
    }

    draw(canvas){
        let context = canvas.getContext("2d")
        if(this.case){
            this.x = this.case.x 
            this.y = this.case.y

        } else {
            let modifX = 0
            let modifY = 2
            let thisIndex = this.side.getPawns().indexOf(this)
            switch(this.side.getPawns().filter((c,index) => c.case == null && index>thisIndex).length ){
                case 1:
                    modifX = 1
                    modifY = 2
                    break;
                case 2:
                    modifX = 0
                    modifY = -0.5
                    break;
                case 3:
                    modifX = 1
                    modifY = -0.5
                    break;
            }
            this.x = ((this.side.cases[0].x + this.side.cases[this.side.cases.length - 2].x) / 2) + modifX
            this.y = ((this.side.cases[0].y + this.side.cases[this.side.cases.length - 2].y) / 2) + modifY
        }
        this.x = (this.x*40) + 50
        this.y = (this.y*20) + 75

        context.beginPath();
        let imgY = (this.side.board.currentSide.currentPawn == this) ? this.y - 55 - (this.side.pawnAnimation*0.22) : this.y - 55
        context.drawImage(this.side.pawnImg, this.x-17.5, imgY, 35, 50);
        this.side.updatePawnAnimation()
        context.ellipse(this.x, this.y, (rayon+4)*0.8, (rayon/2)*0.6, 0, 2 * Math.PI,false);
        context.closePath();
        context.fillStyle = this.side.color;
        context.fill();
    }

    
    getFinalCase(n){
        if(!this.case) return false;
        let currentIndex = this.side.board.cases.findIndex(c => c == this.case) - parseInt(n)
        if(currentIndex > this.side.board.cases.length - 1){
            currentIndex = 0 + (currentIndex - this.side.board.cases.length - 1)
        } else if (currentIndex < 0){
            currentIndex = this.side.board.cases.length - (Math.abs(currentIndex)%this.side.board.cases.length)
        }
        return this.side.board.cases[currentIndex]
    }

    move(n){
        return new Promise((resolve, reject) => {
            if(!this.case) reject(null);
            let finalCase = this.getFinalCase(n)
            if(finalCase) this.setCase(finalCase);
            resolve(true)
        })
    }

    moveTo(c){
        return new Promise((resolve, reject) => {
            this.setCase(c)
            resolve(true)
        })
    }

    howManyCaseforEnd(){
        let finalCase = this.side.cases[this.side.cases.length-1]
        let finalCaseI = this.side.board.cases.indexOf(finalCase)
        let currentCaseI = this.side.board.cases.indexOf(this.case)
        return (finalCaseI<currentCaseI) ? Math.abs(finalCaseI - currentCaseI) : this.side.board.cases.length - (Math.abs(currentCaseI - finalCaseI))
    }
}