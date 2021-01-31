var map = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
var lastMap = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
var space = 16; //剩余空间
var score = 0; //当前得分
var scoreContainer = document.getElementById("score"); //计分板
var finishPage = document.getElementById("finish-page"); //结束游戏页
var isActive = false;
var isWin = false;
var startX, startY, dx, dy, endX, endY;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var numColor = {
    0: "#cdc1b4",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e"
};
var numSize = {
    2: "100",
    4: "100",
    8: "100",
    16: "100",
    32: "100",
    64: "100",
    128: "85",
    256: "85",
    512: "85",
    1024: "65",
    2048: "65"
};
var numOffset = {
    2: 94,
    4: 94,
    8: 94,
    16: 64,
    32: 68,
    64: 68,
    128: 50,
    256: 52,
    512: 52,
    1024: 48,
    2048: 49
};

initGame();
document.getElementById("restart-button").onclick = function () {
    finishPage.className = "hide";
    initGame();
}


/*----functions----*/

function initGame() {
    score = 0;
    space = 16;
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) map[i][j] = 0;
    newNum();
    newNum();
    isActive = true;
    //键盘操作
    document.onkeydown = function (e) {
        if (isActive) {
            for (var i = 0; i < 4; i++)
                for (var j = 0; j < 4; j++) lastMap[i][j] = map[i][j];
            switch (e["key"]) {
                case "ArrowUp":
                    up();
                    break;
                case "ArrowRight":
                    right();
                    break;
                case "ArrowDown":
                    down();
                    break;
                case "ArrowLeft":
                    left();
                    break;
                default:
                    break;
            }
        }
        if (isLost()) {
            finishPage.querySelector("#finish-info").innerHTML = "Game over!";
            finishPage.className = "";
            isActive = false;
        }
        if (isWin) {
            finishPage.querySelector("#finish-info").innerHTML = "You win!";
            finishPage.className = "";
            isActive = false;
            isWin = false;
        }
    }
    //移动端滑动
    document.ontouchstart = function (event) {
        var touch = event.touches[0];
        startX = touch.clientX, startY = touch.clientY;
    }
    document.ontouchmove = function (event) {
        var touch = event.touches[0];
        endX = touch.clientX, endY = touch.clientY;
        dx = endX - startX, dy = endY - startY;
        event.preventDefault();
    }
    document.ontouchend = function (event) {
        if (isActive) {
            for (var i = 0; i < 4; i++)
                for (var j = 0; j < 4; j++) lastMap[i][j] = map[i][j];
            if (dy < -20 && Math.abs(dy / dx) > 2) up();
            if (dy > 20 && Math.abs(dy / dx) > 2) down();
            if (dx < -20 && Math.abs(dx / dy) > 2) left();
            if (dx > 20 && Math.abs(dx / dy) > 2) right();
        }
        if (isLost()) {
            finishPage.querySelector("#finish-info").innerHTML = "Game over!";
            finishPage.className = "";
            isActive = false;
        }
        if (isWin) {
            finishPage.querySelector("#finish-info").innerHTML = "You win!";
            finishPage.className = "";
            isActive = false;
            isWin = false;
        }
    }
}

function drawMap() {
    scoreContainer.innerHTML = score.toString();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var num = map[i][j];
            drawRoundRect(ctx, 24 + j * 224, 24 + i * 224, 200, 200, 10, numColor[num]);
            if (num != 0) {
                ctx.font = "bold " + numSize[num] + "px Consolas, 'Courier New', 'Comic Sans MS'";
                ctx.fillStyle = (num <= 4) ? "#776e65" : "#f9f4f0";
                ctx.fillText(num.toString(), j * 224 + numOffset[num], i * 224 + numSize[num] / 3 + 124);
            }
        }
    }
}

function isLost() {
    // /*debug*/if(score>20)return true;
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            if (map[i][j] == 0) return false;
            if (i < 3 && map[i][j] == map[i + 1][j]) return false;
            if (j < 3 && map[i][j] == map[i][j + 1]) return false;
        }
    return true;
}

function isMoved() {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (map[i][j] != lastMap[i][j]) return true;
    return false;
}

function newNum() {
    var pos = Math.floor(Math.random() * space);
    var k = 0;
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (map[i][j] == 0) {
                if (k == pos) {
                    map[i][j] = (Math.random() < 0.8) ? 2 : 4;
                    drawMap();
                    space -= 1;
                    return;
                }
                k += 1;
            }
}

function up() {
    for (var j = 0; j < 4; j++) {
        var column = [],
            index = 0;
        for (var i = 0; i < 4; i++)
            if (map[i][j] != 0) {
                if (column.length > 0 && column[column.length - 1] == map[i][j]) {
                    column[column.length - 1] *= 2;
                    if (column[column.length - 1] == 2048) isWin = true;
                    score += column[column.length - 1];
                    space += 1;
                } else column.push(map[i][j]);
            }
        for (var i = 0; i < 4; i++) {
            map[i][j] = isNaN(column[index]) ? 0 : column[index];
            index += 1;
        }
    }
    if (isMoved()) newNum();
}

function right() {
    for (var i = 0; i < 4; i++) {
        var column = [],
            index = 0;
        for (var j = 3; j >= 0; j--)
            if (map[i][j] != 0) {
                if (column.length > 0 && column[column.length - 1] == map[i][j]) {
                    column[column.length - 1] *= 2;
                    if (column[column.length - 1] == 2048) isWin = true;
                    score += column[column.length - 1];
                    space += 1;
                } else column.push(map[i][j]);
            }
        for (var j = 3; j >= 0; j--) {
            map[i][j] = isNaN(column[index]) ? 0 : column[index];
            index += 1;
        }
    }
    if (isMoved()) newNum();
}

function down() {
    for (var j = 0; j < 4; j++) {
        var column = [],
            index = 0;
        for (var i = 3; i >= 0; i--)
            if (map[i][j] != 0) {
                if (column.length > 0 && column[column.length - 1] == map[i][j]) {
                    column[column.length - 1] *= 2;
                    if (column[column.length - 1] == 2048) isWin = true;
                    score += column[column.length - 1];
                    space += 1;
                } else column.push(map[i][j]);
            }
        for (var i = 3; i >= 0; i--) {
            map[i][j] = isNaN(column[index]) ? 0 : column[index];
            index += 1;
        }
    }
    if (isMoved()) newNum();
}

function left() {
    for (var i = 0; i < 4; i++) {
        var column = [],
            index = 0;
        for (var j = 0; j < 4; j++)
            if (map[i][j] != 0) {
                if (column.length > 0 && column[column.length - 1] == map[i][j]) {
                    column[column.length - 1] *= 2;
                    if (column[column.length - 1] == 2048) isWin = true;
                    score += column[column.length - 1];
                    space += 1;
                } else column.push(map[i][j]);
            }
        for (var j = 0; j < 4; j++) {
            map[i][j] = isNaN(column[index]) ? 0 : column[index];
            index += 1;
        }
    }
    if (isMoved()) newNum();
}

function drawRoundRect(ctx, x, y, width, height, radius, fillColor) {
    if (2 * radius > width || 2 * radius > height) return false;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath(0);
    ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
    ctx.lineTo(radius, height);
    ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
    ctx.lineTo(0, radius);
    ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
    ctx.lineTo(width - radius, 0);
    ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
    ctx.lineTo(width, height - radius);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.restore();
}