// Initial variables and starting code
var remainingTime = 75,
 Timer,
 MixedQs,
 currentQsIndex;
var timeEl = document.getElementById("runTime");
var startBtn = document.getElementById("startBtn");
var nxtBtn = document.getElementById("nextBtn");
var viewHs = document.getElementById("hsLink");
var submitBtn = document.getElementById("submitBtn");
var resetScoreBtn = document.getElementById("resetBtn");
var initFld = document.getElementById("playerName");
var restartBtn = document.getElementById("restartBtn");
var scoreFld = document.getElementById("playerScore");
var scores = JSON.parse(localStorage.getItem("scores")) || [];
var qContainerEl = document.getElementById("questions");
var strtContainerEl = document.getElementById("initial-container");
var qEl = document.getElementById("question");
var ansrBtnsEl = document.getElementById("answerBtn");
var checkAnsEl = document.getElementById("checkAns");

// For the countdonwn timer
function countTick() {
  remainingTime--;
  timeEl.textContent = "Time: " + remainingTime;
  if (remainingTime <= 0) {
    scoreSave();
  }
};

// This saves the scores
function scoreSave() {
  clearInterval(Timer);
  timeEl.textContent = "Time: " + remainingTime;
  setTimeout(function () {
    qContainerEl.classList.add("hide");
    document.getElementById("container-score").classList.remove("hide");
    document.getElementById("playerScore").textContent =
      "Your score is " + remainingTime;
  }, 2000);
};

 //  One turned into a string this saves to local storage a turnes into an array
var loadScores = function () {
  if (!scoresSaved) {
    return false;
  }
  scoresSaved = JSON.parse(scoresSaved);
  var initials = document.querySelector("#init-field").value;
  var newScore = {
    score: remainingTime,
    initials: initials,
  };
  scoresSaved.push(newScore);
  console.log(scoresSaved);
  scoresSaved.forEach((score) => {
    initFld.innerText = score.initials;
    scoreFld.innerText = score.score;
  });
};

// This is what logs the highscores
function showHs(initials) {
  document.getElementById("container-score").classList.add("hide");
  document.getElementById("hScores").classList.remove("hide");
  strtContainerEl.classList.add("hide");
  qContainerEl.classList.add("hide");
  if (typeof initials == "string") {
    var score = {
      initials,
      remainingTime,
    };
    scores.push(score);
  };

  var highScoreEl = document.getElementById("hScore");
  highScoreEl.innerHTML = "";
  for (i = 0; i < scores.length; i++) {
    var div1 = document.createElement("div");
    var div2 = document.createElement("div");

    div1.setAttribute("class", "name-div");
    div1.innerText = scores[i].initials;
    
    div2.setAttribute("class", "score-div");
    div2.innerText = scores[i].remainingTime;
    highScoreEl.appendChild(div1);
    highScoreEl.appendChild(div2);
  }
  localStorage.setItem("scores", JSON.stringify(scores));
};

// Allows you to look at the highscores link
viewHs.addEventListener("click", showHs);

submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var initials = document.querySelector("#init-field").value;
  showHs(initials);
});

// Reloads the page
restartBtn.addEventListener("click", function () {
  window.location.reload();
});

// This clears the highscores page
resetScoreBtn.addEventListener("click", function () {
  localStorage.clear();
  document.getElementById("hScore").innerHTML = "";
});

// Questions and JavaScript for the questions below
var questions = [
  {
    question: "Which of the following is not a data type?",
    answers: [
      { text: "strings", correct: false },
      { text: "numbers", correct: false },
      { text: "letters", correct: true },
      { text: "booleans", correct: false },
    ],
  },
  {
    question: "What is used to merge two or more arrays?",
    answers: [
      { text: "concat()", correct: true },
      { text: "match()", correct: false },
      { text: "join()", correct: false },
      { text: "combine()", correct: false },
    ],
  },
  {
    question:
      "Strings must be surrounded by what when typed out in Javascript?",
    answers: [
      { text: "commas", correct: false },
      { text: "quotes", correct: true },
      { text: "hashtags", correct: false },
      { text: "<>", correct: false },
    ],
  },
  {
    question: "Arrays in JavaScript can be used to store?",
    answers: [
      { text: "strings", correct: false },
      { text: "numbers", correct: false },
      { text: "other arrays", correct: false },
      { text: "all of the above", correct: true },
    ],
  },
  {
    question: "What method in JavaScript returns the length of a string",
    answers: [
      { text: "size()", correct: false },
      { text: "index()", correct: false },
      { text: "strlength()", correct: false },
      { text: "length()", correct: true },
    ],
  },
];

// Begins the questions and allows for the next button
startBtn.addEventListener("click", beginGame);
nxtBtn.addEventListener("click", () => {
  currentQsIndex++;
  setNextQ();
});


// Begins the quiz and timer
function beginGame() {
  Timer = setInterval(countTick, 1000);
  strtContainerEl.classList.add("hide");
  MixedQs = questions.sort(() => Math.random() - 0.8);
  currentQsIndex = 0;
  qContainerEl.classList.remove("hide");
  countTick();
  setNextQ();
};

// For next question
function setNextQ() {
  resetState();
  showQ(MixedQs[currentQsIndex]);
};

// Shows the questions
function showQ(question) {
  qEl.innerText = question.question;
  question.answers.forEach((answer) => {
    var button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAns);
    ansrBtnsEl.appendChild(button);
  })
};

// Resest the funtion
function resetState() {
  nxtBtn.classList.add("hide");
  checkAnsEl.classList.add("hide");
  while (ansrBtnsEl.firstChild) {
    ansrBtnsEl.removeChild(ansrBtnsEl.firstChild);
  }
};

// Changes color based on answer that is selected
function setClass(element, correct) {
  resetClass(element);
  if (correct) {
    element.classList.add("right");
  } else {
    element.classList.add("wrong");
  }
};

// Gets rid of or removes the classes
function resetClass(element) {
  element.classList.remove("right");
  element.classList.remove("wrong");
};

// Selects the answer
function selectAns(d) {
  var selectedButton = d.target;
  var correct = selectedButton.dataset.correct;
  checkAnsEl.classList.remove("hide");
  // Check the answer if its correct or not and gives a penalty of 5 seconds if incorrect
  if (correct) {
    checkAnsEl.innerHTML = "Thats Correct!";
  } else {
    checkAnsEl.innerHTML = "That was Incorrect!";
    if (remainingTime <= 5) {
      remainingTime = 0;
    } else {
      remainingTime -= 5;
    }
  };
  
  // Removes the hiden quesitons to be displayed
  Array.from(ansrBtnsEl.children).forEach((button) => {
    setClass(button, button.dataset.correct);
  })
  if (MixedQs.length > currentQsIndex + 1) {
    nxtBtn.classList.remove("hide");
    checkAnsEl.classList.remove("hide");
  } else {
    startBtn.classList.remove("hide");
    scoreSave();
  }
};