const addButton = document.getElementById("addButton");
const clearButton = document.getElementById("clearButton");
const balanceButton = document.getElementById("balanceButton");
const canvas = document.getElementById("canvasID");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 0.9*window.innerHeight;

// var numbers = [];
// var numbers = [2, 3, 4] // Balance Test: Right Rotation
// var numbers = [5, 2, 3, 4] // Balance Test: Right Rotation Non-null root
// var numbers = [2, 4, 3] // Balance Test: RL Rotation
var numbers = [1, 2, 4, 3, 5, 8]
// var numbers = [1, 2, 4]

// var numbers = [3, 2, 1]
// var numbers = [1, 2, 3]
// var numbers = [8, 4, 2, 6, 12, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15]
// var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

class Node {
    constructor(val){
        this.value = val;
        this.leftNode = null;
        this.riteNode = null;
        this.height = 1;
        this.parent = null;
    }

    setParent(node){
        this.parent = node;
    }

    addNode(n){
        if (n.value < this.value){
            if (this.leftNode == null){
                n.setParent(this);
                this.leftNode = n;
            } else {
                this.leftNode.addNode(n);
            }
        } else if (n.value > this.value){
            if (this.riteNode == null){
                n.setParent(this);
                this.riteNode = n;
            } else {
                this.riteNode.addNode(n);
            }
        }
        // Calculate Height
        this.calculateHeight();        
        this.balance();
    }

    getHeight(){
        return this.height;
    }
    
    calculateHeight(){
        // Calculate Height
        let leftHeight = null;
        if (this.leftNode == null){
            leftHeight = 0;
        } else {
            this.leftNode.calculateHeight();
            leftHeight = this.leftNode.getHeight();
        }
        let riteHeight = null;
        if (this.riteNode == null){
            riteHeight = 0;
        } else {
            this.riteNode.calculateHeight();
            riteHeight = this.riteNode.getHeight();
        }

        this.height = 1 + Math.max(leftHeight, riteHeight);
    }

    calculateBalanceFactor(){
        let leftHeight = 0;
        let riteHeight = 0;
        if (this.leftNode != null){
            leftHeight = this.leftNode.getHeight();
        }
        if (this.riteNode != null){
            riteHeight = this.riteNode.getHeight();
        }
        return leftHeight-riteHeight;
    }

    balance (){
        this.calculateHeight();

        // Balance Children
        if (this.leftNode != null){
            this.leftNode.balance();
        }
        if (this.riteNode != null){
            this.riteNode.balance();
        }

        // Calculate Balance Factor
        let balanceFactor = this.calculateBalanceFactor();
        let output = `Value: ${this.value}, Balance: ${balanceFactor}`;
        if (this.leftNode != null)
            output += `, Left: ${this.leftNode.calculateBalanceFactor()}`;
        if (this.riteNode != null)
            output += `, Right: ${this.riteNode.calculateBalanceFactor()}`;
        console.log(output);

        // Balance self
        if (balanceFactor < -1){
            if (this.riteNode.calculateBalanceFactor() > 0){
                console.log(`Right-Left Rotating About: ${this.riteNode.leftNode.value}`)
                this.__RL_Rotation();
                this.calculateHeight();
            }
            console.log(`Left Rotating About: ${this.riteNode.value}`)
            this.__LL_Rotation();
        } else if (balanceFactor > 1){
            if (this.leftNode.calculateBalanceFactor() < 0){
                console.log(`Left-Right Rotating About: ${this.leftNode.riteNode.value}`)
                this.__LR_Rotation();
                this.calculateHeight();
            }
            console.log(`Right Rotating About: ${this.leftNode.value}`)
            this.__RR_Rotation();
        }
        this.calculateHeight();
    }

    __RL_Rotation(){
        let tmp = this.riteNode;
        this.riteNode = tmp.leftNode;
        tmp.leftNode.parent = this;
        tmp.parent = this.riteNode;
        tmp.leftNode = this.riteNode.riteNode;
        if (this.riteNode.riteNode != null)
            this.riteNode.riteNode.parent = tmp;
        this.riteNode.riteNode = tmp;
    }
    __RR_Rotation(){
        if (this.parent == null){
            tree.root = this.leftNode;
        } else {
            if (this.parent.leftNode == this){
                this.parent.leftNode = this.leftNode;
            }
            if (this.parent.riteNode == this){
                this.parent.riteNode = this.leftNode;
            }
        }
        this.leftNode.parent = this.parent;
        this.parent = this.leftNode;
        this.leftNode = this.parent.riteNode;
        if (this.leftNode != null)
            this.leftNode.parent = this;
        this.parent.riteNode = this;
    }
    __LR_Rotation(){
        let tmp = this.leftNode;
        this.leftNode = tmp.riteNode;
        tmp.riteNode.parent = this;
        tmp.parent = this.leftNode;
        tmp.riteNode = this.leftNode.leftNode;
        if (this.leftNode.leftNode != null)
            this.leftNode.leftNode.parent = tmp;
        this.leftNode.leftNode = tmp;
    }
    __LL_Rotation(){
        if (this.parent == null){
            tree.root = this.riteNode;
        } else {
            if (this.parent.leftNode == this){
                this.parent.leftNode = this.riteNode;
            }
            if (this.parent.riteNode == this){
                this.parent.riteNode = this.riteNode;
            }
        }
        this.riteNode.parent = this.parent;
        this.parent = this.riteNode;
        this.riteNode = this.parent.leftNode;
        if (this.riteNode != null)
            this.riteNode.parent = this;
        this.parent.leftNode = this;
    }

    draw(x, y, height=0){
        let radius = 40.0
        // console.log(`Value: ${this.value}, Height: ${height}`)

        // Recurse Left
        if (this.leftNode != null){
            let xNew = x - 2.0**height * 1*radius;
            let yNew = y + 2*radius;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xNew, yNew);
            ctx.stroke();
            this.leftNode.draw(xNew, yNew, height-1);
        }
        
        // Recurse Right
        if (this.riteNode != null){
            let xNew = x + 2.0**height * 1*radius;
            let yNew = y + 2*radius;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xNew, yNew);
            ctx.stroke();
            this.riteNode.draw(xNew, yNew, height-1);
        }

        // Draw Self
        ctx.beginPath();
        ctx.arc(x, y, radius, Math.PI * 2, false);
        ctx.fillStyle = '#8c5523';
        ctx.fill();
        ctx.font = '20px serif';
        ctx.fillStyle = '#000000'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        if (this.parent == null)
            ctx.fillText(`${this.value} [${this.height}]`, x, y)
        else
            ctx.fillText(`${this.value}, ${this.parent.value} [${this.height}]`, x, y)
    }
}

class Tree {
    constructor(){
        this.root = null;
    }

    addValue(n){
        var node = new Node(n);

        if (this.root == null){
            this.root = node;
        } else {
            this.root.addNode(node);
        }
    }

    print(){
        // console.log(this.root);
        if (this.root == null)
            return;
        this.root.draw(innerWidth/2.0, 0.1*innerHeight, this.root.getHeight()-1);
    }

    clear (){
        if (this.leftNode != null){
            this.leftNode.clear();
        }
        if (this.riteNode != null){
            this.riteNode.clear();
        }
        this.root = null;
    }

    balance() {
        if (this.root != null)
            this.root.balance();
    }
}

var tree = new Tree();

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);
    tree.print();
}

window.addEventListener('resize', 
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        tree.print();
    }
);

addButton.addEventListener("click", function() {
    numbers.push(document.getElementById("addValue").value);
    document.getElementById("addValue").value = '';
    tree.addValue(numbers[numbers.length-1]);
    tree.print();
});

clearButton.addEventListener("click", function() {
    numbers = [];
    document.getElementById("addValue").value = '';
    tree.clear();
    tree.print();
});

balanceButton.addEventListener("click", function(){
    tree.balance()
    tree.print();
});

document.getElementById("addValue").addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      addButton.click();
    }
  });

for (var n of numbers)
  tree.addValue(n);
animate();
