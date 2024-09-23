"use strict";

var height = 6;
var width = 5;

var col = 0;
var row = 0;

var gameOver = false;
var word = wordsArray[Math.floor(Math.random() * wordsArray.length)];

window.onload = function () {
    initialize();
}

function initialize() {

    //顯示要猜測數字
    console.log(word);

    //創造面板
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            tile.classList.add('tile');
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    //創造鍵盤
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Backspace"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Enter"],
        ["Z", "X", "C", "V", "B", "N", "M"]]


    for (let i = 0; i < keyboard.length; i++) {
        let currentRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currentRow.length; j++) {
            let keytile = document.createElement("button");
            let key = currentRow[j];
            keytile.innerText = key;
            if (key === "Enter") {
                keytile.innerHTML = "&#8629";
                keytile.id = "Enter";
            }
            else if (key === "Backspace") {
                keytile.innerHTML = "&#9003;";
                keytile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z") {
                keytile.id = "Key" + key;
            }

            keytile.addEventListener("click", processKey);

            if (key === "Enter") {
                keytile.classList.add("Enter-key-tile")
            }
            else if (key === "Backspace") {
                keytile.classList.add("Backspace-key-tile")
            }
            else {
                keytile.classList.add("key-tile")
            }
            keyboardRow.appendChild(keytile);
        }
        document.getElementById("keyboardArea").appendChild(keyboardRow);
    }

    document.addEventListener("keyup", (e) => {
        processInput(e);
    })
}

function processKey() {
    let e = { "code": this.id };
    processInput(e);
}

function processInput(e) {
    if (gameOver) return;
    document.getElementById("answer").innerText = "You can do it !";
    // alert(e.code);
    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {

            let currentTile = document.getElementById(row.toString() + "-" + col.toString());
            if (currentTile.innerText === "") {
                currentTile.innerText = e.code[3];
                col += 1;
            }
        }
    }
    else if (e.code === "Enter") {
        update();
    }
    else if (e.code === "Backspace") {
        if (0 < col && col <= width) {
            col -= 1;
        }
        let currentTile = document.getElementById(row.toString() + "-" + col.toString());
        currentTile.innerHTML = "";
    }

    if (!gameOver && row === height) {
        gameOver = true;
        document.getElementById("answer").innerText = "The answer is " + word;
    }
}

function update() {

    let guess = "";
    document.getElementById("answer").innerText = "Try again !";
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase();
    if (!wordsArray.includes(guess)) {

        document.getElementById("answer").innerText = "Not a valid word !!!";
        return;
    }

    let correct = 0;

    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (letterCount[letter]) {
            letterCount[letter]++;
        }
        else {
            letterCount[letter] = 1;
        }
    }

    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText.toLowerCase();
        if (word[c] === letter) {
            currentTile.classList.add("correct");

            let keytile = document.getElementById("Key" + letter.toUpperCase());
            keytile.classList.remove("present");
            keytile.classList.add("correct");

            correct += 1;
            letterCount[letter] -= 1;
        }

        if (correct === width) {
            gameOver = true;
            document.getElementById("answer").innerText = "You win !";
        }
    }

    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText.toLowerCase();
        if (!currentTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currentTile.classList.add("present");

                let keytile = document.getElementById("Key" + letter.toUpperCase());
                if (!keytile.classList.contains("correct")) {
                    keytile.classList.add("present");
                }

                letterCount[letter] -= 1;
            }
            else {
                let keytile = document.getElementById("Key" + letter.toUpperCase());
                if (!keytile.classList.contains("correct") && !keytile.classList.contains("present")) {
                    keytile.classList.add("absent");
                }
                currentTile.classList.add("absent");
            }
        }

        if (correct === width) {
            gameOver = true;
        }
    }

    row += 1;
    col = 0;

}