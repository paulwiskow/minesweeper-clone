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
var background_color = "#d4d4d4"

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

function clickBox(event) {
    const box_location = findBoxFromMouseLocation(event);
    ctx.fillStyle = background_color;
    ctx.fillRect((BORDER_SIZE + BORDER_SIZE * box_location.x) + (TILE_SIZE * box_location.x), (BORDER_SIZE + BORDER_SIZE * box_location.y) + (TILE_SIZE * box_location.y), TILE_SIZE, TILE_SIZE);
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