window.onload = initAll;
var sboard = new Array(81);
var board = new Array(81);
var bool = new Array(81);
var cboard = new Array(81);
var startLife;
var life;
var s;
var si;
var count;

function initAll() {
  document.getElementById("play").onclick = play;
  document.getElementById("newGame").onclick = newGame;
  document.getElementById("hint").onclick = hint;
  document.getElementById("submit").onclick = submit;
}

function play() {
  document.getElementById("diagBoxOut").style.visibility = "hidden";
  clearBoard();
  var n = setClues();
  updateLife();
  createSudoku();
  setBoard(n);
  setupBoard(board);
  setcurrentBoard();
  fillFun();
}

function fillFun() {
  for (var i = 0; i < 81; i++) {
    document.getElementById(i).onclick = fillFun2;
  }
}

function fillFun2() {
  magic(this.id);
  if (this.style.fontWeight == 400) {
    for (var i = 1; i < 10; i++) {
      document.getElementById("num" + i).onclick = fillFun3;
    }
    document.getElementById("clear").onclick = fillFun4;
  } else {
    for (var i = 1; i < 10; i++) {
      document.getElementById("num" + i).onclick = false;
      document.getElementById("clear").onclick = false;
    }
  }
}

function fillFun3() {
  for (i = 0; i < 81; i++) {
    if (
      document.getElementById(i).className == "uniqueCell" ||
      document.getElementById(i).className == "uniqueCell, wrongCell"
    ) {
      document.getElementById(i).value = this.value;
      checkFill(i);
    }
  }
}

function fillFun4() {
  for (i = 0; i < 81; i++) {
    if (
      document.getElementById(i).className == "uniqueCell" ||
      document.getElementById(i).className == "uniqueCell, wrongCell"
    ) {
      document.getElementById(i).value = "";
      for (var j = 0; j < 81; j++) {
        v = document.getElementById(j).value;
        fw = document.getElementById(j).style.fontWeight;
        if (v != "") {
          if (fw == 400) {
            setcurrentBoard();
            cboard[j] = 0;
            if (acceptable(cboard, j, v)) {
              document.getElementById(j).className = "cell";
            } else {
              document.getElementById(j).className = "wrongCell";
            }
          }
        }
      }
      magic(i);
      document.getElementById(i).className = "uniqueCell";
    }
  }
}

function checkFill(index) {
  for (var i = 0; i < 81; i++) {
    v = document.getElementById(i).value;
    fw = document.getElementById(i).style.fontWeight;
    if (v != "") {
      if (fw == 400) {
        setcurrentBoard();
        cboard[i] = 0;
        if (acceptable(cboard, i, v)) {
          document.getElementById(i).className = "cell";
        } else {
          document.getElementById(i).className = "wrongCell";
        }
      }
    }
  }
  v = document.getElementById(index).value;
  setcurrentBoard();
  cboard[index] = 0;
  if (acceptable(cboard, index, v)) {
    document.getElementById(index).className = "uniqueCell";
  } else {
    document.getElementById(index).className = "uniqueCell, wrongCell";
    if (life == 0) {
      alert("Game Over!!");
      document.getElementById("diagBoxOut").style.visibility = "visible";
    } else {
      life--;
      updateLife();
    }
  }
  magic(index);
}

function magic(index) {
  for (var i = 0; i < 81; i++) {
    if (document.getElementById(i).className == "uniqueCell, wrongCell") {
      document.getElementById(i).className = "wrongCell";
    }
    if (!(document.getElementById(i).className == "wrongCell")) {
      document.getElementById(i).className = "cell";
    }
  }
  var { row, col } = i2rc(index);
  for (var i = 0; i < 9; i++) {
    if (!(document.getElementById(rc2i(i, col)).className == "wrongCell")) {
      document.getElementById(rc2i(i, col)).className = "relatedCell";
    }
  }
  for (var i = 0; i < 9; i++) {
    if (!(document.getElementById(rc2i(row, i)).className == "wrongCell")) {
      document.getElementById(rc2i(row, i)).className = "relatedCell";
    }
  }
  var r1 = Math.floor(row / 3) * 3;
  var c1 = Math.floor(col / 3) * 3;
  for (var r = r1; r < r1 + 3; r++) {
    for (var c = c1; c < c1 + 3; c++) {
      if (!(document.getElementById(rc2i(r, c)).className == "wrongCell")) {
        document.getElementById(rc2i(r, c)).className = "relatedCell";
      }
    }
  }
  if (document.getElementById(index).className == "wrongCell") {
    document.getElementById(index).className = "uniqueCell, wrongCell";
  } else {
    document.getElementById(index).className = "uniqueCell";
  }
}

function setcurrentBoard() {
  for (var i = 0; i < 81; i++) {
    var v = document.getElementById(i).value;
    if (v == "") {
      cboard[i] = 0;
    } else {
      cboard[i] = v;
    }
  }
}

function clearBoard() {
  for (var i = 0; i < 81; i++) {
    board[i] = 0;
    sboard[i] = 0;
    bool[i] = 0;
    document.getElementById(i).value = "";
    document.getElementById(i).placeholder = "";
    document.getElementById(i).className = "cell";
    document.getElementById(i).style.fontWeight = 400;
    document.getElementById("hint").name = "5";
    document.getElementById("hint").value = "Hint (5)";
  }
}

function setClues() {
  var l1 = document.getElementById("l1");
  var l2 = document.getElementById("l2");
  var n;
  if (l1.checked) {
    n = Math.floor(Math.random() * 5) + 36;
    startLife = life = 10;
  } else if (l2.checked) {
    n = Math.floor(Math.random() * 9) + 27;
    startLife = life = 7;
  } else {
    n = Math.floor(Math.random() * 8) + 19;
    startLife = life = 5;
  }
  return n;
}

function updateLife() {
  document.getElementById("life").innerHTML =
    "Life Remaining: " + life + "/" + startLife;
}

function createSudoku() {
  s = 0;
  si = Math.floor(Math.random() * 1001);
  match(sboard);
  presetSudoku();
}

function presetSudoku() {
  var a1 = Math.floor(Math.random() * 101);
  var a2 = Math.floor(Math.random() * 101);
  var a3 = Math.floor(Math.random() * 11);
  var a4 = Math.floor(Math.random() * 11);
  var i;
  for (i = 0; i < a1; i++) {
    var b = randomInt();
    var r1 = randomInt();
    var r2 = randomInt();
    swapRow(b, r1, r2);
  }
  for (i = 0; i < a2; i++) {
    var b = randomInt();
    var c1 = randomInt();
    var c2 = randomInt();
    swapCol(b, c1, c2);
  }
  for (i = 0; i < a3; i++) {
    var r1 = randomInt();
    var r2 = randomInt();
    swapRowBand(r1, r2);
  }
  for (i = 0; i < a4; i++) {
    var c1 = randomInt();
    var c2 = randomInt();
    swapColBand(c1, c2);
  }
}

function randomInt() {
  var m = Math.floor(Math.random() * 3);
  return m;
}

function solve(arr) {
  var { index, moves } = bestBet(arr);
  if (index == null) {
    count++;
    if (count == 2) {
      return false;
    } else {
      return false;
    }
  }
  for (var m of moves) {
    arr[index] = m;
    if (solve(arr)) {
      return true;
    }
  }
  arr[index] = 0;
  return false;
}

function match(b) {
  var { index, moves } = bestBet(b);
  if (index == null) {
    if (s == si) {
      return true;
    } else {
      s++;
      return false;
    }
  }
  for (var m of moves) {
    sboard[index] = m;
    if (match(sboard)) {
      return true;
    }
  }
  sboard[index] = 0;
  return false;
}

function bestBet(b) {
  var index,
    moves,
    bestLen = 100;
  for (var i = 0; i < 81; i++) {
    if (b[i] == 0) {
      var m = getRealChoices(b, i);
      if (m.length < bestLen) {
        bestLen = m.length;
        moves = m;
        index = i;
        if (bestLen == 0) {
          break;
        }
      }
    }
  }
  return { index, moves };
}

function i2rc(i) {
  return { row: Math.floor(i / 9), col: i % 9 };
}

function rc2i(r, c) {
  return r * 9 + c;
}

function acceptable(b, i, v) {
  var { row, col } = i2rc(i);
  for (var r = 0; r < 9; r++) {
    if (b[rc2i(r, col)] == v) {
      return false;
    }
  }
  for (var c = 0; c < 9; c++) {
    if (b[rc2i(row, c)] == v) {
      return false;
    }
  }
  var r1 = Math.floor(row / 3) * 3;
  var c1 = Math.floor(col / 3) * 3;
  for (var r = r1; r < r1 + 3; r++) {
    for (var c = c1; c < c1 + 3; c++) {
      if (b[rc2i(r, c)] == v) {
        return false;
      }
    }
  }
  return true;
}

function getRealChoices(b, i) {
  var realChoices = [];
  for (var v = 1; v <= 9; v++) {
    if (acceptable(b, i, v)) {
      if (uniqueBox(b, i, v) || uniqueRow(b, i, v) || uniqueCol(b, i, v)) {
        return [v];
      } else {
        realChoices.push(v);
      }
    }
  }
  return realChoices;
}

function uniqueBox(b, i, v) {
  var { row, col } = i2rc(i);
  var r1 = Math.floor(row / 3) * 3;
  var c1 = Math.floor(col / 3) * 3;
  for (var r = r1; r < r1 + 3; r++) {
    for (var c = c1; c < c1 + 3; c++) {
      var a = rc2i(r, c);
      if (a != i && b[a] == 0 && acceptable(b, a, v)) {
        return false;
      }
    }
  }
  return true;
}

function uniqueRow(b, i, v) {
  var { row, col } = i2rc(i);
  for (var c = 0; c <= 9; c++) {
    var a = rc2i(row, c);
    if (a != i && b[a] == 0 && acceptable(b, a, v)) {
      return false;
    }
  }
  return true;
}

function uniqueCol(b, i, v) {
  var { row, col } = i2rc(i);
  for (var r = 0; r <= 9; r++) {
    var a = rc2i(r, col);
    if (a != i && b[a] == 0 && acceptable(b, a, v)) {
      return false;
    }
  }
  return true;
}

function swapRow(b, r1, r2) {
  var t;
  for (var i = 0; i < 9; i++) {
    t = sboard[b * 27 + r1 * 9 + i];
    sboard[b * 27 + r1 * 9 + i] = sboard[b * 27 + r2 * 9 + i];
    sboard[b * 27 + r2 * 9 + i] = t;
  }
}

function swapCol(b, c1, c2) {
  var t;
  for (var i = 0; i < 9; i++) {
    t = sboard[b * 3 + c1 + i * 9];
    sboard[b * 3 + c1 + i * 9] = sboard[b * 3 + c2 + i * 9];
    sboard[b * 3 + c2 + i * 9] = t;
  }
}

function swapRowBand(r1, r2) {
  var t;
  for (var i = 0; i < 27; i++) {
    t = sboard[r1 * 27 + i];
    sboard[r1 * 27 + i] = sboard[r2 * 27 + i];
    sboard[r2 * 27 + i] = t;
  }
}

function swapColBand(c1, c2) {
  var t;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 9; j++) {
      t = sboard[c1 * 3 + j * 9 + i];
      sboard[c1 * 3 + j * 9 + i] = sboard[c2 * 3 + j * 9 + i];
      sboard[c2 * 3 + j * 9 + i] = t;
    }
  }
}

function setBoard(n) {
  for (var i = 0; i < 81; i++) {
    board[i] = sboard[i];
  }
  var b;
  var a = 81;
  var v;
  var l = 0;
  while (l < 81 && a != n) {
    do {
      v = Math.floor(Math.random() * 81);
    } while (bool[v]);
    bool[v] = 1;
    board[v] = 0;
    count = 0;
    solve(board);
    if (count != 1) {
      board[v] = sboard[v];
    }
    a = countClues(board);
    l++;
  }
}

function countClues(b) {
  var n = 0;
  for (var i = 0; i < 81; i++) {
    if (b[i]) {
      n++;
    }
  }
  return n;
}

function setupBoard(b) {
  for (var i = 0; i < 81; i++) {
    if (b[i]) {
      document.getElementById(i).value = b[i];
      document.getElementById(i).style.fontWeight = 550;
    }
  }
}

function newGame() {
  var c = confirm(
    "Are you sure that you want to leave this game and start a new one?"
  );
  if (c) {
    document.getElementById("diagBoxOut").style.visibility = "visible";
  }
  return false;
}

function hint() {
  if (this.name > 0) {
    var arr = [];
    for (var i = 0; i < 81; i++) {
      if (
        document.getElementById(i).value == "" &&
        document.getElementById(i).placeholder == ""
      ) {
        arr.push(i);
      }
    }
    var r = Math.floor(Math.random() * arr.length);
    document.getElementById(arr[r]).placeholder = sboard[arr[r]];
    this.name = this.name - 1;
    this.value = "Hint (" + this.name + ")";
  } else {
    alert("No more hints are left.");
  }
}

function submit() {
  for (var i = 0; i < 81; i++) {
    if (document.getElementById(i).value == "") {
      alert(
        "Some of the cells in the Sudoku are not fillled.\nTry to fill them all."
      );
      return false;
    }
  }
  for (var i = 0; i < 81; i++) {
    if (
      document.getElementById(i).className == "wrongCell" ||
      document.getElementById(i).className == "uniqueCell, wrongCell"
    ) {
      alert(
        "Some of the cells are incorrectly filled.\nTry to correct them all."
      );
      return false;
    }
  }
  alert("Well Done! You solved the sudoku.");
  var ask;
  ask = confirm("Would you like to play a New Game?");
  if (ask) {
    document.getElementById("diagBoxOut").style.visibility = "visible";
  }
}
