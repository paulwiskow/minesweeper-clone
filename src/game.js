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

let map = [];  // 0 means empty, -1 is mine, >0 is the number on it
let tracker = [];  // tracks what is opened (1) and what is not (0) and if a flag is there (2)
let flag_count = 0;

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

    initializeMap(x, y);
}

function generateMap(origin_x, origin_y, minecount, boardx, boardy) {
    let i = 0;
    
    while (i < minecount) {
        const randx = Math.floor(Math.random() * boardx);
        const randy = Math.floor(Math.random() * boardy);

        if (randx === origin_x + 1 || randx === origin_x - 1 || randy === origin_y + 1 || randy === origin_y - 1 || (randx === origin_x && randy === origin_y)) {
            continue;
        }

        map[randy][randx] = -1;
        i++;
    }

    // Map out all the numbers
    for(let y = 0; y < boardy; y++) {
        for(let x = 0; x < boardx; x++) {
            if (map[y][x] === -1) continue;
            let mine_count = 0;
            for(let l = -1; l < 2; l++) {
                if (y + l >= map.length || y + l < 0) continue;
                for(let o = -1; o < 2; o++) {
                    if (x + o >= map[0].length || x + o < 0) continue;
                    if (map[y + l][x + o] === -1) {
                        mine_count++;
                    }
                }
            }

            map[y][x] = mine_count;
        }
    }
}

function initializeMap(x, y) {
    for(let i = 0; i < y; i++) {
        let temp = [];
        for(let j = 0; j < x; j++) {
            temp.push(0);
        }
        map.push(temp);
        tracker.push(JSON.parse(JSON.stringify(temp)));
    }

    console.log(map);
}

function clickBox(event) {
    const box_location = findBoxFromMouseLocation(event);
    const x = (BORDER_SIZE + BORDER_SIZE * box_location.x) + (TILE_SIZE * box_location.x);
    const y = (BORDER_SIZE + BORDER_SIZE * box_location.y) + (TILE_SIZE * box_location.y);
    ctx.fillStyle = background_color;
    
    if(tracker[box_location.y][box_location.x] === 2 || tracker[box_location.y][box_location.x] === 1) {
        return;
    } else if(first_click) {
        first_click = false;
        generateMap(box_location.x, box_location.y, EXPERT_MINE_COUNT, EXPERT_X, EXPERT_Y);
        openConnectedNothingBoxes(x, y);
    } else if(map[box_location.y][box_location.x] === -1) {
        // game over, reveal all mines
    } else if(map[box_location.y][box_location.x] > 0 && tracker[box_location.y][box_location.x] !== 1) {
        // console.log("click number", box_location.x, box_location.y);
        // console.log(JSON.parse(JSON.stringify(tracker)));
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        addNumber(box_location.x, box_location.y, x, y);
        tracker[box_location.y][box_location.x] = 1;
    } else {
        // console.log("click open", box_location.x, box_location.y);
        // console.log(JSON.parse(JSON.stringify(tracker)));
        openConnectedNothingBoxes(x, y);
    }
}

function openConnectedNothingBoxes(x, y) {
    ctx.fillStyle = background_color;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    const temp_map = JSON.parse(JSON.stringify(map));  // Had to make a temporary copy to mark tiles as seen
    const mx = Math.floor((x - BORDER_SIZE) / (BORDER_SIZE + TILE_SIZE));
    const my = Math.floor((y - BORDER_SIZE) / (BORDER_SIZE + TILE_SIZE));
    temp_map[my][mx] = -3;
    tracker[my][mx] = 1;
    let queue = new Queue();
    queue.enqeue([x, y]);

    while (!queue.isEmpty()) {
        const coords = queue.dequeue();
        const temp_x = coords[0];
        const temp_y = coords[1];

        const map_x = Math.floor((temp_x - BORDER_SIZE) / (BORDER_SIZE + TILE_SIZE));
        const map_y = Math.floor((temp_y - BORDER_SIZE) / (BORDER_SIZE + TILE_SIZE));

        for(let i = -1; i < 2; i++) {
            if (map_y + i >= temp_map.length || map_y + i < 0) continue;
            for(let j = -1; j < 2; j++) {
                if (map_x + j >= temp_map[0].length || map_x + j < 0) continue;
                if (temp_map[map_y + i][map_x + j] === -3 || tracker[map_y + i][map_x + j] === 2 || temp_map[map_y + i][map_x + j] === -1) continue;
                if (temp_map[map_y + i][map_x + j] === 0) {
                    ctx.fillRect(temp_x + j * (TILE_SIZE + BORDER_SIZE), temp_y + i * (TILE_SIZE + BORDER_SIZE), TILE_SIZE, TILE_SIZE);
                    queue.enqeue([temp_x + j * (TILE_SIZE + BORDER_SIZE), temp_y + i * (TILE_SIZE + BORDER_SIZE)]);
                } else if (temp_map[map_y + i][map_x + j] > 0) {
                    ctx.fillRect(temp_x + j * (TILE_SIZE + BORDER_SIZE), temp_y + i * (TILE_SIZE + BORDER_SIZE), TILE_SIZE, TILE_SIZE);

                    const x = (BORDER_SIZE + BORDER_SIZE * (map_x + j)) + (TILE_SIZE * (map_x + j));
                    const y = (BORDER_SIZE + BORDER_SIZE * (map_y + i)) + (TILE_SIZE * (map_y + i));
                    addNumber(map_x + j, map_y + i, x, y);
                    ctx.fillStyle = background_color;
                }

                temp_map[map_y + i][map_x + j] = -3;
                tracker[map_y + i][map_x + j] = 1;
            }
        }
    }
}

function addNumber(map_x, map_y, board_x, board_y) {
    ctx.font = "20pt ＭＳ Ｐゴシック";
    ctx.textAlign = "center";

    const mine_count = map[map_y][map_x];
    ctx.fillStyle = returnNumColor(mine_count);
    if (mine_count > 0) {
        ctx.fillText(`${mine_count}`, board_x + TILE_SIZE / 2, board_y + (TILE_SIZE - 5));
    }
}

function returnNumColor(mine_count) {
    switch(mine_count) {
        case 1:
            return "blue";
        case 2:
            return "green";
        case 3:
            return "red";
        case 4:
            return "#00008b";
        case 5:
            return "#835A36";
        case 6:
            return "#008B8B";
        case 7:
            return "black";
        case 8: 
            return "grey";
        default:
            return "blue";
    }
}

function toggleFlag(e) {
    const map_coords = findBoxFromMouseLocation(e);
    const map_x = map_coords.x;
    const map_y = map_coords.y;
    const board_x = (BORDER_SIZE + BORDER_SIZE * map_x) + (TILE_SIZE * map_x);
    const board_y = (BORDER_SIZE + BORDER_SIZE * map_y) + (TILE_SIZE * map_y);
    // console.log(tracker);

    if(tracker[map_y][map_x] === 0) {  // add flag
        const flag = new Image();
        flag.src = "src/images/red_flag.png";
        flag.onload = function() {
            ctx.drawImage(flag, board_x, board_y, TILE_SIZE, TILE_SIZE);
        }

        tracker[map_y][map_x] = 2;
        flag_count++;
    } else if (tracker[map_y][map_x] === 2) {  // undo flag
        ctx.fillStyle = "#8a8a8a";
        ctx.fillRect(board_x, board_y, TILE_SIZE, TILE_SIZE);

        tracker[map_y][map_x] = 0;
        flag_count--;
    }
}

function findBoxFromMouseLocation(e) {
    const rect = canvas.getBoundingClientRect();
    // Converts to coords in the canvas
    const mouse_coords =  {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };

    // This is the conversion to map coordinates 
    return {
        x:  Math.floor((mouse_coords.x - BORDER_SIZE) / (BORDER_SIZE + TILE_SIZE)),
        y:  Math.floor((mouse_coords.y - BORDER_SIZE) / (BORDER_SIZE + TILE_SIZE))
    };
}

window.addEventListener("load", drawInitialBoard(EXPERT_X, EXPERT_Y, "#c4c4c4", "#8a8a8a"));
canvas.addEventListener('mousedown', function(evt) {
    if(evt.button == 0) {
        // left click
        clickBox(evt);
    } else if (evt.button === 1) {
        // middle mouse button
    } else if (evt.button === 2) {
        // right click
        toggleFlag(evt);
    }
});