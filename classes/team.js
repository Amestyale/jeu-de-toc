class Team{
    sides = [];

    
    constructor(sides) {
        this.sides = sides
        this.sides.forEach(side => {
            side.team = this
        });
    }

    pawnsAlive(){
        let c = 0
        this.sides.forEach(side => {
            side.pawns.forEach(pawn => {
                c++
            });
        });
        return c
    }

    pawns(){
        let r = []
        this.sides.forEach(side => {
            side.pawns.forEach(pawn => {
                r.push(pawn)
            });
        });
        return r
    }
}