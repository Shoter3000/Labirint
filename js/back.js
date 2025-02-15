
const startButton = document.querySelector('.start');
const resetButton = document.querySelector('.reset');
const slider = document.querySelector('.speedAdjust');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 726;
const CANVAS_HEIGHT = canvas.height = 740;
const hdmiPic = new Image();
const leaves = new Image();
leaves.src = 'img/animationSprite.svg';
hdmiPic.src = 'img/hdmi.svg';
let leafX = 165, leafY = 2;

resetButton.disabled = true;
let speed = 50;
startButton.addEventListener('click', () =>{
    let points = "234,2 234,10 202,10 202,42 186,42 186,138 170,138 170,122 154,122 154,138 138,138 138,202 154,202 154,218 138,218 138,250 122,250 122,266 26,266 26,282 74,282 74,298 90,298 90,314 74,314 74,330 90,330 90,346 58,346 58,362 106,362 106,346 122,346 122,330 138,330 138,362 186,362 186,282 202,282 202,330 218,330 218,346 202,346 202,378 186,378 186,394 218,394 218,410 234,410 234,442 202,442 202,458 266,458 266,474 250,474 250,482";
    let arr = create2DArrayFromCoordinates(points);
    console.log(arr[0]);
    arr = middlePoint(arr);
    drawAndMove(arr, speed);
});

slider.addEventListener('input', () =>{
    speed = slider.value * -1;
});

resetButton.addEventListener('click', () =>{
    if(checkReset()){
        let points = "234,2 234,10 202,10 202,42 186,42 186,138 170,138 170,122 154,122 154,138 138,138 138,202 154,202 154,218 138,218 138,250 122,250 122,266 26,266 26,282 74,282 74,298 90,298 90,314 74,314 74,330 90,330 90,346 58,346 58,362 106,362 106,346 122,346 122,330 138,330 138,362 186,362 186,282 202,282 202,330 218,330 218,346 202,346 202,378 186,378 186,394 218,394 218,410 234,410 234,442 202,442 202,458 266,458 266,474 250,474 250,482";
        let arr = create2DArrayFromCoordinates(points);
        console.log(arr[0]);
        arr = middlePoint(arr);
        reset(arr, speed);
    }
});


function create2DArrayFromCoordinates(points) {
    // Split the input string into an array of coordinate pairs
    let coordinates = points.split(" ");

    // Map each coordinate pair into an array of [x, y]
    let result = coordinates.map(pair => {
        let [x, y] = pair.split(",").map(Number);
        return [x, y];
    });

    return result;
}


function reset(points, speed) {
    let polyPoints = points.join(" ");
    let poly = document.querySelector("polyline");
    let index = points.length - 1;
    resetButton.disabled = true;
    slider.disabled = true;
    reverseMoveAndDraw();

    function reverseMoveAndDraw() {
        if (index < 0) {
            startButton.disabled = false;
            slider.disabled = false;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            return;
        }
        
        polyPoints = polyPoints.split(" ").slice(0, index).join(" ");
        poly.setAttribute("points", polyPoints);

        let [x, y] = points[index] || points[0];
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(hdmiPic, (x * 1.5) - 16, (y * 1.5) - 16, 32, 32);

        index--;
        setTimeout(reverseMoveAndDraw, speed);
    }
}


function checkReset(){
    let poly = document.querySelector("polyline");
    return poly.getAttributeNames().includes("points");
}

function mazeToGrid(){
    let svg = document.querySelector(".maze").children[0];
    let walls = document.querySelectorAll('line');
    console.log(walls);
    console.log(parseInt(svg.getAttribute('height')));
    let gridx =  parseInt(svg.getAttribute('height')), gridY = parseInt(svg.getAttribute('height'));
    let x1, x2, y1, y2;
    let grid = [];
    
    for (let i = 0; i < gridx; i++) {
        grid[i] = new Array(gridY).fill(0);
    }
    console.log(grid);

    for(let i = 0; i < walls.length; i++){
        x1 = parseInt(walls[i].getAttribute('x1'));
        x2 = parseInt(walls[i].getAttribute('x2'));
        y1 = parseInt(walls[i].getAttribute('y1'));
        y2 = parseInt(walls[i].getAttribute('y2'));

        //y je isti sam x se spreminja -> za vsak line da v grid 1 kot wall
        if(y1 == y2){
            for(let j = x1; j <=x2; j++){
                console.log(y1);
                grid[y1][j] = 1;
            }
        }
        else if(y1 != y2){
            for(let j = y1; j <= y2; j++){
                grid[j][x1] = 1;
            }
        }
    }

    addStartEnd();

    function addStartEnd(){
        let start = walls[0].getAttribute('y1');
        let end = walls[walls.length-1].getAttribute('y2');
        console.log("y1: "+start);
        console.log("end: "+end)

        let drawnStart = false

        for(let i = 2; i < walls[0].length; i++){
            if(walls[i] == 0){
                
            }
        }

    
    }
    console.log(grid);


}

function middlePoint(points){
    let extra = "";
    let start, end;

    for(let idx = 0; idx < points.length; idx++){
        if(idx === points.length-1)
            break;
        let start = points[idx];
        let end = points[idx+1];
        if(Math.abs(start[0]) == Math.abs(end[0])){ // x1 = x2 -> y spremeni
            extra += points[idx] + " " + start[0]+ "," + ((start[1]+end[1])/2)+" " + points[idx+1]+" ";
        }
        else if(Math.abs(start[1]) == Math.abs(end[1])){
            extra += points[idx] + " " + ((start[0]+end[0])/2) +","+ start[1]+" " + points[idx+1]+" ";
        }

    }
   let points2 = create2DArrayFromCoordinates(extra);
   return points2;
}


function drawAndMove(points, speed) {
    let polyPoints = "";
    let poly = document.querySelector("polyline");
    let index = 0;
    startButton.disabled = true;
    slider.disabled = true;
    poly.setAttribute("points", "");
    poly.setAttribute('stroke', '#545252');
    moveAndDraw();

    function moveAndDraw() {
        if (index >= points.length) {
            resetButton.disabled = false;
            slider.disabled = false;
            // Draw the image one last time at the final point
            let [x, y] = points[points.length - 2];
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(hdmiPic, (x * 1.5) - 16, (y * 1.5) - 16, 32, 32);
            return;
        }
        
        polyPoints += " " + points[index];
        poly.setAttribute("points", polyPoints);

        let [x, y] = points[index];
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(hdmiPic, (x * 1.5) - 16, (y * 1.5) - 16, 32, 32);
        
        index++;
        setTimeout(moveAndDraw, speed);
    }
}

