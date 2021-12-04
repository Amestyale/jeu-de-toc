const rayon = 13
class Case {
                
    constructor(x,y,side) {
        this.x = x
        this.y = y
        this.side = side
        this.side.cases.push(this)
    }

    draw(canvas, preview){
        let context = canvas.getContext("2d")
        if(preview ){
            context.beginPath();
            context.ellipse((this.x*40) + 50, this.y*(20) + 75, rayon+4, rayon/2.5, 0, 2 * Math.PI,false);
            context.closePath();
            context.fillStyle = `rgba(255,215,0,0.5)`;
            context.fill();
        }
        context.beginPath();
        context.ellipse((this.x*40) + 50, this.y*(20) + 75, rayon+4, rayon/2, 0, 2 * Math.PI,false);
        context.closePath();
        context.strokeStyle = this.side.color;
        context.lineWidth = 2;
        context.stroke();

    }

}