class Lollipop {
    constructor(x, y, rotation, color, text) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.color = color;
        this.text = text;
        this.radius = 10;
        this.stickLength = 120;
        this.stickWidth = 1;
    }

    draw(ctx) {

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // 棒棒糖的竿子
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.stickLength);
        ctx.lineWidth = this.stickWidth;
        ctx.strokeStyle = this.color;
        ctx.stroke();

        // 棒棒糖的球
        ctx.beginPath();
        ctx.arc(0, -this.stickLength, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // 繪製數字
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, 0, -this.stickLength);

        ctx.restore();
    }
}

class Ball {
    constructor(x, y, radius, color, number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.number = number;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // 繪製數字
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.number, this.x, this.y);
    }
}

class Game {
    constructor(canvas, speed, numLollipops, numBalls, time, degree, CurrentLevel, TotalLevel, heart, isSound) {
        this.isStart = false; //遊戲是否仍在開始
        this.CurrentLevel = CurrentLevel; //現在是第幾關
        this.TotalLevel = TotalLevel;//這個難度的關卡總共有幾關
        this.heart = heart;//目前剩下愛心數量
        this.canvas = canvas;//畫布
        this.ctx = canvas.getContext('2d');//畫布
        this.x = canvas.width / 2;//大球的位置
        this.y = canvas.height / 3;//大球的位置
        this.radius = 20;//大球的大小
        this.OriSpeed = speed;//原始旋轉速度
        this.speed = speed; //每一次的旋轉速度
        this.numLollipops = numLollipops; //初始棒棒糖
        this.numBalls = numBalls; // 初始球(有幾發子彈)
        this.lollipopCounter = 1; //已經新增棒棒糖(已經射出幾發子彈)
        this.isAdd = false; //剛剛有沒有新增棒棒糖，有的話要檢查他是否發生碰撞
        this.lollipops = []; //現在在大球上的棒棒糖
        this.balls = []; //所有子彈的位置

        //射出子彈事件(點擊畫布、按下空白鍵)
        this.canvas.addEventListener('click', this.addLollipopBelow.bind(this));
        window.addEventListener('keydown', function (event) {
            if (event.code === 'Space') {
                this.addLollipopBelow();
            }
        }.bind(this));

        this.time = time; // 每間隔多久更改一次轉的方向
        this.degree = degree; //這次遊戲的難度
        this.animationFrameId = null; //刷屏動畫
        this.rotationIntervalId = null; //變換方向的時間控制器

        this.startGameLoop(); // 遊戲開始的方程

        //音效相關
        this.isSound = isSound;//是否播放音效
        this.collisionSound = new Audio('./material/fail.mp3'); //遊戲未通關音效
        this.pass = new Audio('./material/pass.mp3'); //遊戲通關音效
        this.arrow = new Audio('./material/arror.mp3') //遊戲射出子彈音效

    }

    startGameLoop() {
        this.isStart = true;
        if (!this.animationFrameId)
            this.animationFrameId = requestAnimationFrame(() => this.draw());
        if (!this.rotationIntervalId && this.time > 0)
            this.rotationIntervalId = setInterval(this.toggleRotationDirection.bind(this), this.time);
        this.lollipopCounter = 1;
        this.isAdd = false;
        this.speed = this.OriSpeed;
        this.initLollipops();
        this.initBalls();
    }

    stopGameLoop() {
        this.isStart = false;
        this.clearAnimationFrame();
        this.clearRotationTimer();
    }

    clearRotationTimer() {
        if (this.rotationIntervalId) {
            clearInterval(this.rotationIntervalId);
            this.rotationIntervalId = null;
        }
    }

    clearAnimationFrame() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    toggleRotationDirection() {

        var randomNum = Math.random();
        var scaledNum = 0;

        switch (this.degree) {
            case 1:
                scaledNum = Math.abs(this.OriSpeed) - 0.0075 + randomNum * 0.015;
                break;
            case 2:
                scaledNum = Math.abs(this.OriSpeed) - 0.01 + randomNum * 0.02;
                break;
            case 3:
                scaledNum = Math.abs(this.OriSpeed) - 0.015 + randomNum * 0.03;
                break;
            default:
                scaledNum = this.OriSpeed * 1;
        }
        console.log(this.speed);
        if (this.speed > 0)
            this.speed = -scaledNum;
        else if (this.speed < 0)
            this.speed = scaledNum;
        console.log(this.speed);
        if (this.rotationIntervalId && this.time != 0) {
            randomNum = Math.random();
            scaledNum = 0;
            switch (this.degree) {
                case 1:
                    scaledNum = this.time - 700 + randomNum * 1400;
                    break;
                case 2:
                    scaledNum = this.time - 500 + randomNum * 1000;
                    break;
                case 3:
                    scaledNum = this.time - 300 + randomNum * 600;
                    break;
                default:
                    scaledNum = this.time * 0;
            }
            this.clearRotationTimer();
            this.rotationIntervalId = setInterval(this.toggleRotationDirection.bind(this), scaledNum);
        }
    }

    initLollipops() {
        this.lollipops = [];
        const angleStep = (Math.PI * 2) / this.numLollipops;
        for (let i = 0; i < this.numLollipops; i++) {
            const angle = i * angleStep;
            const lollipopX = this.x + this.radius * Math.cos(angle);
            const lollipopY = this.y + this.radius * Math.sin(angle);
            const lollipopRotation = angle + Math.PI / 2;
            const lollipop = new Lollipop(lollipopX, lollipopY, lollipopRotation, 'black', '');
            this.lollipops.push(lollipop);
        }
    }

    initBalls() {
        this.balls = [];
        const BallRadius = 10;
        const BallSpacing = 10; // 球之間的間距
        const startX = this.x; // 畫布中間的 x 位置
        const startY = this.y + this.radius + 160;// 球開始的 y 位置

        for (let i = this.lollipopCounter - 1; i < this.numBalls; i++) {
            const x = startX;
            const y = startY + (i - this.lollipopCounter + 1) * (BallRadius * 2 + BallSpacing);
            const ball = new Ball(x, y, BallRadius, 'red', i + 1);
            this.balls.push(ball);
        }
    }

    draw() {
        if (this.isStart) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.isAdd == true) {
                this.collisionDetection();
                this.checkWin();
            }
            this.drawCircle();
            this.drawLollipops();
            this.drawBalls();
            this.animationFrameId = requestAnimationFrame(() => this.draw());
        }
        else
            this.stopGameLoop();
    }

    drawCircle() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.closePath();
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
    }

    drawLollipops() {
        const angleStep = (Math.PI * 2) / this.numLollipops;
        this.lollipops.forEach((lollipop, index) => {
            const angle = this.speed + lollipop.rotation - Math.PI / 2;
            const lollipopX = this.x + this.radius * Math.cos(angle);
            const lollipopY = this.y + this.radius * Math.sin(angle);
            lollipop.x = lollipopX;
            lollipop.y = lollipopY;
            lollipop.rotation = angle + Math.PI / 2;
            lollipop.draw(this.ctx);
        });
    }

    drawBalls() {
        this.balls = [];
        this.initBalls();
        this.balls.forEach(ball => {
            ball.draw(this.ctx);
        });
    }

    addLollipopBelow(event) {
        if (this.numBalls >= this.lollipopCounter) {
            if (this.isSound) {
                this.arrow.currentTime = 0;
                this.arrow.play();
            }
            const angle = (Math.PI * 2) / 4;
            const lollipopX = this.x + this.radius * Math.cos(angle);
            const lollipopY = this.y + this.radius * Math.sin(angle);
            const lollipopRotation = angle + Math.PI / 2;
            const lollipop = new Lollipop(lollipopX, lollipopY, lollipopRotation, 'red', this.lollipopCounter);
            this.lollipops.push(lollipop);
            this.lollipopCounter++; //以射出子彈增加
            this.isAdd = true;//有射出子彈，需要檢查
        }
    }

    collisionDetection() {
        this.isAdd = false;
        const lollipop1 = this.lollipops[this.lollipops.length - 1];
        const lollipop1X = lollipop1.x + lollipop1.stickLength * Math.cos(lollipop1.rotation - Math.PI / 2);
        const lollipop1Y = lollipop1.y + lollipop1.stickLength * Math.sin(lollipop1.rotation - Math.PI / 2);
        for (let i = 0; i < this.lollipops.length - 1; i++) {
            const lollipop2 = this.lollipops[i];
            const lollipop2X = lollipop2.x + lollipop2.stickLength * Math.cos(lollipop2.rotation - Math.PI / 2);
            const lollipop2Y = lollipop2.y + lollipop2.stickLength * Math.sin(lollipop2.rotation - Math.PI / 2);
            const dx = lollipop1X - lollipop2X;
            const dy = lollipop1.y - lollipop2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < lollipop1.radius + lollipop2.radius) {
                this.showGameOverPopup();
                break;
            }
        }

    }

    checkWin() {
        if (this.lollipopCounter === this.numBalls + 1 && this.isStart) {
            if (this.isSound) {
                this.pass.currentTime = 0;
                this.pass.play();
            }
            this.stopGameLoop();
            document.querySelector('.next-level-container').style.display = 'flex';
            if (this.CurrentLevel >= this.TotalLevel - 1) {
                document.getElementById('next-level-h1').innerText = " Victory !! ";
                document.getElementById('next-level-button').innerText = " Restart Game ";
            }
        }
    }

    showGameOverPopup() {
        if (this.isSound) {
            this.collisionSound.currentTime = 0;
            this.collisionSound.play();
        }
        this.stopGameLoop();
        document.querySelector('.game-over-container').style.display = 'flex';
        if (this.heart < 1) {
            document.getElementById("use-heart-button").style.display = 'none';
        }
        else {
            document.getElementById("use-heart-button").style.display = 'block';
        }
    }
}

class Level {
    constructor(speed, numLollipops, numBalls, time, degree) {
        this.speed = speed;
        this.numLollipops = numLollipops;
        this.numBalls = numBalls;
        this.time = time;
        this.degree = degree;
    }
}

var currentLevelIndex = 0; //現在是第幾關
var game; // 關卡的宣告
var isHard = false; // 可以選擇關卡難度嗎? 只有還未開始遊戲時可以
var harddegree = 1; //遊戲初始難度可以調整
var heart = 5; //愛心初始數量
var levels; //關卡中間變數儲存陣列
var isBGM = true; //是否播放BGM
var isSound = true;//是否播放音效
const breakheart = new Audio('./material/heart.wav'); //心碎音效
const BGM = new Audio('./material/BGM.mp3');//BGM
const levelHeading = document.getElementById('HowLevel'); //寫第幾關的container
BGM.volume = 0.3; //BGM音量
BGM.play(); //BGM一開始就播放除非有關掉

function decisiondegree() {
    if (harddegree == 1) {
        levels = [
            new Level(0.02, 3, 7, 0, 0),
            new Level(0.025, 3, 12, 0, 0),
            new Level(0.025, 5, 15, 0, 0),
            new Level(0.03, 8, 10, 0, 0),
            new Level(-0.03, 8, 15, 0, 0)
        ];
    }
    else if (harddegree == 2) {
        levels = [
            new Level(0.03, 8, 10, 0, 0), new Level(0.03, 8, 15, 0, 0),
            new Level(0.03, 5, 8, 3000, 1), new Level(0.03, 6, 10, 2000, 2),
            new Level(-0.03, 7, 8, 3000, 2), new Level(0.04, 8, 8, 3000, 1),
            new Level(0.05, 9, 7, 3000, 3), new Level(-0.05, 10, 5, 3000, 3),
            new Level(0.06, 5, 8, 5000, 2), new Level(-0.06, 5, 8, 6000, 3)
        ];
    }
    else if (harddegree == 3) {
        levels = [
            new Level(0.06, 9, 7, 3000, 3),
            new Level(-0.06, 10, 5, 3000, 3),
            new Level(0.07, 7, 8, 5000, 3),
            new Level(-0.07, 8, 8, 6000, 3),
            new Level(-0.08, 6, 10, 6000, 3)
        ];
    }
}

function startLevel(levelIndex) {
    decisiondegree();
    if (isBGM)
        BGM.play();
    if (levelIndex >= levels.length) {
        return;
    }
    const level = levels[levelIndex];
    const canvas = document.getElementById('myCanvas');
    levelHeading.innerText = `第${currentLevelIndex + 1}關`;
    document.getElementById('next-level-h1').innerText = " You Win!!  ";
    document.getElementById('next-level-button').innerText = " Next Level ";
    game = new Game(canvas, level.speed, level.numLollipops, level.numBalls, level.time, level.degree, currentLevelIndex, levels.length, heart, isSound);
    game.startGameLoop();
}

function nextLevel() {
    currentLevelIndex++;
    if (currentLevelIndex < levels.length) {
        startLevel(currentLevelIndex);
    }
}

function updateHearts(heart) {
    const heartContainer = document.getElementById('heart');
    const pictures = heartContainer.getElementsByClassName('picture');
    for (let i = 0; i < pictures.length; i++) {
        if (i < heart) {
            pictures[i].src = './material/flex.png'; // 替換粉色愛心
        } else {
            pictures[i].src = './material/none.png'; // 替換空心愛心
        }
    }
}

function toggleColor(buttonId) {
    if (!isHard) {
        const buttons = document.querySelectorAll('.degreebutton');
        buttons.forEach(button => {
            button.classList.remove('green');
        });
        const clickedButton = document.getElementById(buttonId);
        harddegree = buttonId.replace('button', '');
        clickedButton.classList.add('green');
    }
}

document.getElementById('start-game-button').addEventListener('click', function () {
    document.querySelector('.start-game-container').style.display = 'none';
    document.querySelector('.overlay').style.display = 'flex';
    isHard = true;
    startLevel(currentLevelIndex);
});

document.getElementById('restart-button').addEventListener('click', function () {
    game.stopGameLoop();
    currentLevelIndex = 0;
    isHard = false;
    heart = 5;
    updateHearts(heart);
    document.querySelector('.start-game-container').style.display = 'flex';
    document.querySelector('.overlay').style.display = 'none';
});

document.getElementById('reset-button').addEventListener('click', function () {
    game.stopGameLoop();
    startLevel(currentLevelIndex);
});

document.getElementById('next-level-button').addEventListener('click', function () {
    if (currentLevelIndex < levels.length - 1) {
        document.querySelector('.next-level-container').style.display = 'none';
        document.querySelector('.overlay').style.display = 'flex';
        nextLevel();
    }
    else {
        currentLevelIndex = 0;
        isHard = false;
        heart = 5;
        updateHearts(heart);
        document.querySelector('.start-game-container').style.display = 'flex';
        document.querySelector('.next-level-container').style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
});

document.getElementById('game-over-button').addEventListener('click', function () {
    currentLevelIndex = 0;
    isHard = false;
    heart = 5;
    updateHearts(heart);
    document.querySelector('.start-game-container').style.display = 'flex';
    document.querySelector('.game-over-container').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
});

document.getElementById('use-heart-button').addEventListener('click', function () {
    if (isSound)
        breakheart.play();
    document.querySelector('.game-over-container').style.display = 'none';
    document.querySelector('.overlay').style.display = 'flex';
    levelHeading.innerText = `第${currentLevelIndex}關`;
    heart -= 1;
    updateHearts(heart);
    startLevel(currentLevelIndex);
})

document.getElementById('BGM').addEventListener('click', function () {
    const BGMContainer = document.getElementById('BGM');
    if (isBGM) {
        BGM.pause();
        isBGM = false;
        BGMContainer.src = './material/BGM_off.png';
    } else if (!isBGM) {
        BGM.play();
        isBGM = true;
        BGMContainer.src = './material/BGM_on.png';
    }
})

document.getElementById('sound').addEventListener('click', function () {
    const soundContainer = document.getElementById('sound');
    if (isSound) {
        isSound = false;
        soundContainer.src = './material/soundEffect_off.png';
    } else {
        isSound = true;
        soundContainer.src = './material/soundEffect_on.png';
    }
    if (game) {
        game.isSound = isSound;
    }
});

