// TRACK TIME AND QUIZ NUMBER
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// SOUNDS FOR CORRECT AND INCORRECT QUIZ ANSWER CHOICES
var sound_correct = new Audio("assets/sfx/correct.wav");
var sound_incorrect = new Audio("assets/sfx/incorrect.wav");

//ELEMENT VARIABLES AND BUTTONS
var choices_element = document.getElementById("choices");
var feedback_element = document.getElementById("feedback");
var initials_element = document.getElementById("initials");

var questions_element = document.getElementById("questions");

var start_button = document.getElementById("start");
var submit_button = document.getElementById("submit");

var timer_element = document.getElementById("time");


//FUNCTION FOR QUIZ TIMER
function startQuiz() {

  var begin_screen_element = document.getElementById("start-screen");
  begin_screen_element.setAttribute("class", "hide");

  
  questions_element.removeAttribute("class");

  timerId = setInterval(clockTick, 1000);


  timer_element.textContent = time;

  getQuestion();
}

//FUNCTION TO EXTRACT QUIZ NUMBER AND SHOW CONTENTS FROM QUESTIONS.JS
function getQuestion() {

  var currentQuestion = questions[currentQuestionIndex];


  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;


  choices_element.innerHTML = "";


  currentQuestion.choices.forEach(function(choice, i) {

    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

 
    choiceNode.onclick = questionClick;


    choices_element.appendChild(choiceNode);
  });
}


//FUNCTION FOR RIGHT / WRONG SOUNDS AND SCORE / TIME PENALTY
function questionClick() {
 
  if (this.value !== questions[currentQuestionIndex].answer) {

    time -= 15;

    if (time < 0) {
      time = 0;
    }

    timer_element.textContent = time;

  
    sound_incorrect.play();

    feedback_element.textContent = "Wrong!";
  } else {

    sound_correct.play();

    feedback_element.textContent = "Correct!";
  }


  feedback_element.setAttribute("class", "feedback");
  setTimeout(function() {
    feedback_element.setAttribute("class", "feedback hide");
  }, 1000);


  currentQuestionIndex++;

  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

//FUNCTION WHEN THE QUIZ IS DONE
function quizEnd() {

  clearInterval(timerId);

  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");


  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  questions_element.setAttribute("class", "hide");
}

//FUNCTION FOR WHEN THE TIME RUNS OUT AND TO CHECK TIME
function clockTick() {

  time--;
  timer_element.textContent = time;

  if (time <= 0) {
    quizEnd();
  }
}

//FUNCTION FOR SAVING SCORES
function saveHighscore() {

  var initials = initials_element.value.trim();


  if (initials !== "") {

    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];


    var newScore = {
      score: time,
      initials: initials
    };


    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));


    window.location.href = "highscores.html";
  }
}

//EXTRA FUNCTION WHEN THE USER HITS THE ENTER KEY
function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}


submit_button.onclick = saveHighscore;

start_button.onclick = startQuiz;

initials_element.onkeyup = checkForEnter;