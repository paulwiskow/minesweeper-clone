// Beginner, medium, expert, and custom boards -> start with 3 base difficulties
// Just make a grid
const EASY_X = 9;
const EASY_Y = 9;
const EASY_MINE_COUNT = 10;
const MEDIUM_X = 16;
const MEDIUM_Y = 16;
const MEDIUM_MINE_COUNT = 40;
const EXPERT_X = 30;
const EXPERT_Y = 16;
const EXPERT_MINE_COUNT = 99;

// can add variable board size later, right now just use constants
const TILE_SIZE = 30;
const BORDER_SIZE = 3;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let background_color = "#d4d4d4";
let first_click = true;
// Text coordinates are based on bottom left corner

// Could potentially implement a set of blocks that are "non-clickable" -> already opened tiles and flagged tiles
const FIRST_LAYER_PROBABILITY = .60;  // If a mine randomly spawns here, they have another 60 percent chance to spawn at that point -> the gradient will probably have to change per board size
const SECOND_LAYER_PROBABILITY = .80;  // Same logic as before, can change
let map = [];  // 0 means nothing, 1 is mine, 2 is flagged

// Drawing expert board initially, expert will probably be default difficulty
function drawInitialBoard(x, y, tile_color, border_color) {
    canvas.width = (TILE_SIZE * x) + ((x + 1) * BORDER_SIZE);
    canvas.height = (TILE_SIZE * y) + ((y + 1) * BORDER_SIZE);
    ctx.fillStyle = tile_color;
    for(let i = 0; i < y + 1; i++) {
        ctx.fillRect(0, (BORDER_SIZE + TILE_SIZE) * i, canvas.width, BORDER_SIZE);
    }
    for(let i = 0; i < x + 1; i++) {
        ctx.fillRect((BORDER_SIZE + TILE_SIZE) * i, 0, BORDER_SIZE, canvas.height);
    }

    ctx.fillStyle = border_color;
    for(let i = 0; i < y; i++) {
        for(let j = 0; j < x; j++) {
            ctx.fillRect((BORDER_SIZE + BORDER_SIZE * j) + (TILE_SIZE * j), (BORDER_SIZE + BORDER_SIZE * i) + (TILE_SIZE * i), TILE_SIZE, TILE_SIZE);
        }
    }
}

function generateMap(origin_x, origin_y, minecount, boardx, boardy) {
    initializeMap(boardx, boardy);
    // generate the 2d array with the bombs in relation to where the user clicked taking in mind the probability gradient around where the user clicked (probably only 1 or 2 layers out)
    let i = 0;
    while (i < minecount) {
        const randx = Math.random() * boardx;
        const randy = Math.random() * boardy;

        if (randx === origin_x + 1 || randy === origin_y + 1 || (randx === origin_x && randy === origin_y)) {
            continue;
        } else if (randx === origin_x + 2 || randy === origin_y + 2) {
            if (Math.random() >= FIRST_LAYER_PROBABILITY) {
                continue;
            }
        } else if (randx === origin_x + 3 || randy === origin_y + 3) {
            if (Math.random() >= SECOND_LAYER_PROBABILITY) {
                continue;
            }
        }

        map[randy][randx] = 1;
        i++;
    }
}

function initializeMap(x, y) {
    for(let i = 0; i < y; i++) {
        let temp = [];
        for(let j = 0; j < x; j++) {
            temp.push(0);
        }
        map.push(temp);
    }
}

function clickBox(event) {
    const box_location = findBoxFromMouseLocation(event);
    const x = (BORDER_SIZE + BORDER_SIZE * box_location.x) + (TILE_SIZE * box_location.x);
    const y = (BORDER_SIZE + BORDER_SIZE * box_location.y) + (TILE_SIZE * box_location.y);
    ctx.fillStyle = background_color;
    
    if (first_click) {
        first_click = false;
        generateMap(x, y);
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillRect(x, y + 1, TILE_SIZE, TILE_SIZE);
        ctx.fillRect(x, y - 1, TILE_SIZE, TILE_SIZE);
        ctx.fillRect(x + 1, y, TILE_SIZE, TILE_SIZE);
        ctx.fillRect(x + 1, y + 1, TILE_SIZE, TILE_SIZE);
        ctx.fillRect(x + 1, y - 1, TILE_SIZE, TILE_SIZE);
        ctx.fillRect(x - 1, y, TILE_SIZE, TILE_SIZE);
        ctx.fillRect(x - 1, y + 1, TILE_SIZE, TILE_SIZE);
        ctx.fillRect(x - 1, y - 1, TILE_SIZE, TILE_SIZE);
    } else {
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }
}

function addNumber(x, y) {
    // Messed around with putting the mine numbers after you click
    ctx.font = "20pt ＭＳ Ｐゴシック";
    ctx.textAlign = "center";
    ctx.fillStyle = "blue";
    // ctx.fillText("2", x + TILE_SIZE / 2, y + (TILE_SIZE - 5));

    let mine_count = 0;
    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            if (map[y + i][x + j] === 1) {
                mine_count++;
            }
        }
    }

    if (mine_count !== 0) {
        
    }
}

function findBoxFromMouseLocation(e) {
    const rect = canvas.getBoundingClientRect();
    const mouse_coords =  {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };

    return {
        x:  Math.floor((mouse_coords.x - BORDER_SIZE) / (BORDER_SIZE + TILE_SIZE)),
        y:  Math.floor((mouse_coords.y - BORDER_SIZE) / (BORDER_SIZE + TILE_SIZE))
    };
}

window.addEventListener("load", drawInitialBoard(EXPERT_X, EXPERT_Y, "#c4c4c4", "#8a8a8a"));
window.addEventListener("click", clickBox)