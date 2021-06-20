const canvas = document.getElementById("canvas2");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bugArray = [];

class FireFly {
    constructor(x, y, directionX, directionY, size){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = '#ffffff';
        this.otherColor = '#ffe814'
        this.colorChangeFrequency = (Math.random() * 250 + 50);
        this.colorChangeTime = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.colorChangeTime += 1;
        if (this.colorChangeTime > this.colorChangeFrequency){
            this.colorChangeTime = 0;
            let newColor = this.otherColor;
            this.otherColor = this.color;
            this.color = newColor;
        }
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

function init() {
    bugArray = [];
    let nParticles = (canvas.width * canvas.height) / 900;
    for (let i = 0; i < nParticles; i++){
        let x = (Math.random() * canvas.width );
        let y = (Math.random() * canvas.height );
        let directionX = (Math.random() *2) - 1;
        let directionY = (Math.random() *2) - 1;

        bugArray.push(new FireFly(x, y, directionX, directionY, 3));

    }
}

function coupleFrequencies() {
    
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);

    for (let i = 0; i < bugArray.length; i++){
        bugArray[i].update();
    }

    coupleFrequencies();
}

window.addEventListener('resize', 
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    }
);

init();
animate();