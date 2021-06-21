const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

class Particle {
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#8c5523';
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }

        let radiusX = this.x - mouse.x;
        let radiusY = this.y - mouse.y;
        let dist = Math.sqrt(radiusX*radiusX + radiusY*radiusY);
        if (dist < mouse.radius + this.size){

            let projectionLength = (radiusX*this.directionX + radiusY*this.directionY) /
                                   (radiusX*radiusX + radiusY*radiusY);
            if (projectionLength < 0){
                this.directionX -= 2.0 * projectionLength * radiusX;
                this.directionY -= 2.0 * projectionLength * radiusY;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

function init() {
    particlesArray = [];
    let nParticles = (canvas.width * canvas.height) / 900;
    for (let i = 0; i < nParticles; i++){
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size*2) - (size*2)) + size*2 );
        let y = (Math.random() * ((innerHeight - size*2) - (size*2)) + size*2 );
        let directionX = (Math.random() *2) - 1;
        let directionY = (Math.random() *2) - 1;
        let color = '#8c5523';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));

    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);

    for (let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }

    connect();
}

function connect() {
    for (let a = 0; a < particlesArray.length; a++){
        for (let b = a+1; b < particlesArray.length; b++){
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let threshold = 0.1 * Math.min(canvas.width, canvas.height);
            if (distance < threshold){
                ctx.strokeStyle = 'rgba(140,85,31,1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', 
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = (canvas.height/80) * (canvas.width/80);
        init();
    }
);

window.addEventListener('mouseout', 
    function(){
        mouse.x = null;
        mouse.y = null;
    }
)

init();
animate();