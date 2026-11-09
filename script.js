/**
 * Web Development Multiple-Choice Quiz Application
 * Vanilla ES6 JavaScript Implementation
 * Design Inspired by https://quiz.bato.dev/
 */

// =============================================================================
// 1. QUESTION DATA (10 Original Multiple-Choice Questions)
// =============================================================================
const questions = [
  {
    question: "Which HTML5 element is semantically intended for independent, self-contained content that could be distributed on its own?",
    options: ["<aside>", "<section>", "<article>", "<div>"],
    correctAnswer: 2,
    explanation: "<article> represents an autonomous piece of content, such as a blog post or news story, suitable for independent syndication."
  },
  {
    question: "What will the expression `typeof NaN` evaluate to in JavaScript?",
    options: ["'number'", "'NaN'", "'undefined'", "'object'"],
    correctAnswer: 0,
    explanation: "In JavaScript, NaN ('Not-a-Number') is technically a numeric data type defined by the IEEE-754 standard, so typeof returns 'number'."
  },
  {
    question: "Which CSS property specifies how flex or grid items are distributed along the main axis?",
    options: ["align-items", "justify-content", "place-items", "align-content"],
    correctAnswer: 1,
    explanation: "The justify-content property distributes space and aligns items along the container's main axis."
  },
  {
    question: "What is the primary difference between the `==` and `===` equality operators in JavaScript?",
    options: [
      "== allows type coercion, while === strictly compares both value and type",
      "=== allows type coercion, while == strictly compares reference identity",
      "== is only used for strings, while === is used for numeric values",
      "There is no difference in modern ECMAScript specifications"
    ],
    correctAnswer: 0,
    explanation: "The == operator coerces differing types before comparison, whereas === strictly requires both identical types and values."
  },
  {
    question: "Which JavaScript array method creates a new array populated with elements that pass a given test function?",
    options: ["map()", "forEach()", "filter()", "reduce()"],
    correctAnswer: 2,
    explanation: "The filter() method iterates through an array and returns a new array with all elements that return a truthy value."
  },
  {
    question: "What is the primary purpose of the `Event.preventDefault()` method?",
    options: [
      "Stops the event from bubbling up the DOM hierarchy",
      "Cancels the default action that the browser normally executes for the event",
      "Unbinds all event listeners from the target element",
      "Deletes the element that received the event"
    ],
    correctAnswer: 1,
    explanation: "preventDefault() cancels the default browser behavior (such as form submission or link navigation) without halting propagation."
  },
  {
    question: "Which standard JSON method converts a JavaScript object into a JSON string representation?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "Object.toJSON()"],
    correctAnswer: 1,
    explanation: "JSON.stringify() serializes a JavaScript object, array, or primitive into a formatted JSON string."
  },
  {
    question: "In modern JavaScript, what is the key scoping distinction between `let` and `var`?",
    options: [
      "var is block-scoped, while let is function-scoped",
      "let is block-scoped, while var is function-scoped",
      "var creates immutable constants, while let creates mutable variables",
      "let declarations are hoisted to the window object, while var declarations are not"
    ],
    correctAnswer: 1,
    explanation: "Variables declared with let are confined to the enclosing curly brace block, whereas var declarations are function-scoped."
  },
  {
    question: "Which HTTP status code communicates that the requested resource could not be found on the server?",
    options: ["200", "301", "404", "500"],
    correctAnswer: 2,
    explanation: "HTTP 404 Not Found indicates that the origin server cannot locate a current representation for the requested target URL."
  },
  {
    question: "When does the browser fire the `DOMContentLoaded` event on the document?",
    options: [
      "After all external stylesheets, images, and embedded frames have finished loading",
      "When the initial HTML document has been completely parsed, without waiting for images or stylesheets",
      "Whenever any DOM node is clicked or mutated by the user",
      "Immediately before the browser window is unloaded"
    ],
    correctAnswer: 1,
    explanation: "DOMContentLoaded fires as soon as the HTML DOM tree is constructed, enabling scripts to run before heavy media assets finish loading."
  }
];

// =============================================================================
// 2. APPLICATION STATE
// =============================================================================
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let incorrectCount = 0;
let unansweredCount = 0;
let userAnswerHistory = [];
let remainingTime = 60;
let isQuestionAnswered = false;
let timerInterval = null;
let autoAdvanceTimeoutId = null;

// =============================================================================
// 3. DOM ELEMENT REFERENCES
// =============================================================================
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const welcomeTotalQuestionsEl = document.getElementById("welcome-total-questions");
const startBtn = document.getElementById("start-btn");

const currentQuestionNumEl = document.getElementById("current-question-num");
const totalQuestionsNumEl = document.getElementById("total-questions-num");
const timerDisplayEl = document.getElementById("timer-display");
const currentScoreEl = document.getElementById("current-score");
const progressBarFill = document.getElementById("progress-bar-fill");

const questionTextEl = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const optionButtons = Array.from(document.querySelectorAll(".option-btn"));
const feedbackMessageEl = document.getElementById("feedback-message");
const nextBtn = document.getElementById("next-btn");

// Bato-themed feedback banner & bottom explanation bar
const feedbackTopBanner = document.getElementById("feedback-top-banner");
const bannerTitle = document.getElementById("banner-title");
const bannerSubtitle = document.getElementById("banner-subtitle");
const bottomExplanationBar = document.getElementById("bottom-explanation-bar");
const explanationText = document.getElementById("explanation-text");

const finalScoreEl = document.getElementById("final-score");
const maxScoreEl = document.getElementById("max-score");
const scorePercentageEl = document.getElementById("score-percentage");
const correctCountEl = document.getElementById("correct-count");
const incorrectCountEl = document.getElementById("incorrect-count");
const unansweredCountEl = document.getElementById("unanswered-count");
const performanceMessageEl = document.getElementById("performance-message");
const reviewContainer = document.getElementById("review-container");
const restartBtn = document.getElementById("restart-btn");

// =============================================================================
// 4. SCREEN SWITCHING & HELPER FUNCTIONS
// =============================================================================
const showScreen = (screenToShow) => {
  [welcomeScreen, quizScreen, resultsScreen].forEach((screen) => {
    if (screen === screenToShow) {
      screen.classList.remove("hidden");
      screen.removeAttribute("hidden");
    } else {
      screen.classList.add("hidden");
      screen.setAttribute("hidden", "");
    }
  });
};

const clearAllTimers = () => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (autoAdvanceTimeoutId !== null) {
    clearTimeout(autoAdvanceTimeoutId);
    autoAdvanceTimeoutId = null;
  }
};

// =============================================================================
// 5. CORE QUIZ FUNCTIONS
// =============================================================================

/**
 * Initializes and starts a new quiz attempt from the first question.
 */
function startQuiz() {
  clearAllTimers();

  currentQuestionIndex = 0;
  score = 0;
  correctCount = 0;
  incorrectCount = 0;
  unansweredCount = 0;
  userAnswerHistory = [];
  isQuestionAnswered = false;

  showScreen(quizScreen);
  showQuestion();
}

/**
 * Renders the question and options for the current question index.
 */
function showQuestion() {
  clearAllTimers();
  isQuestionAnswered = false;

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  // Update header progress, score, and progress track
  currentQuestionNumEl.textContent = questionNumber;
  totalQuestionsNumEl.textContent = totalQuestions;
  currentScoreEl.textContent = score;

  const progressPercent = (questionNumber / totalQuestions) * 100;
  if (progressBarFill) {
    progressBarFill.style.width = `${progressPercent}%`;
    if (progressBarFill.parentElement) {
      progressBarFill.parentElement.setAttribute("aria-valuenow", questionNumber);
    }
  }

  // Set question prompt text
  questionTextEl.textContent = currentQuestion.question;

  // Reset and populate the 4 answer option buttons
  optionButtons.forEach((btn, index) => {
    btn.disabled = false;
    btn.className = "option-btn bato-option-pill";

    const textSpan = btn.querySelector(".option-text");
    if (textSpan) {
      textSpan.textContent = currentQuestion.options[index];
    } else {
      btn.textContent = currentQuestion.options[index];
    }
  });

  // Hide feedback banners & bottom explanation bar
  if (feedbackTopBanner) feedbackTopBanner.classList.add("hidden");
  if (bottomExplanationBar) bottomExplanationBar.classList.add("hidden");

  feedbackMessageEl.className = "feedback-message hidden";
  feedbackMessageEl.textContent = "";
  nextBtn.classList.add("hidden");
  nextBtn.setAttribute("hidden", "");

  // Start the 60-second countdown timer
  startTimer();
}

/**
 * Starts a 60-second countdown for the current question.
 */
function startTimer() {
  clearAllTimers();
  remainingTime = 60;

  timerDisplayEl.textContent = `${remainingTime}s`;
  timerDisplayEl.classList.remove("timer-warning");

  timerInterval = setInterval(() => {
    remainingTime -= 1;
    timerDisplayEl.textContent = `${remainingTime}s`;

    if (remainingTime <= 10) {
      timerDisplayEl.classList.add("timer-warning");
    }

    if (remainingTime <= 0) {
      clearAllTimers();
      handleTimeout();
    }
  }, 1000);
}

/**
 * Handles expiration of the 60-second timer.
 * Deducts 1 point, records question as unanswered, reveals correct answer, and auto-advances.
 */
function handleTimeout() {
  if (isQuestionAnswered) return;
  isQuestionAnswered = true;

  clearAllTimers();

  // Deduct penalty and update stats
  score -= 1;
  unansweredCount += 1;
  currentScoreEl.textContent = score;

  const currentQuestion = questions[currentQuestionIndex];

  // Disable all options and reveal the correct one
  optionButtons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === currentQuestion.correctAnswer) {
      btn.classList.add("correct");
    }
  });

  // Save to review history
  userAnswerHistory.push({
    question: currentQuestion.question,
    options: currentQuestion.options,
    selectedIndex: null,
    correctAnswer: currentQuestion.correctAnswer,
    result: "unanswered",
    explanation: currentQuestion.explanation
  });

  // Show timeout feedback
  showFeedback(
    "timeout",
    `Time expired! (-1 point penalty applied). ${currentQuestion.explanation}`
  );

  // Reveal Next button and schedule auto-advance
  nextBtn.classList.remove("hidden");
  nextBtn.removeAttribute("hidden");

  autoAdvanceTimeoutId = setTimeout(() => {
    nextQuestion();
  }, 2500);
}

/**
 * Validates the user's selected choice against the correct answer.
 * @param {number} selectedIndex - The zero-based index of the chosen option.
 */
function checkAnswer(selectedIndex) {
  if (isQuestionAnswered) return;
  isQuestionAnswered = true;

  clearAllTimers();

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedIndex === currentQuestion.correctAnswer;

  if (isCorrect) {
    score += 1;
    correctCount += 1;
    currentScoreEl.textContent = score;

    optionButtons[selectedIndex].classList.add("correct");

    userAnswerHistory.push({
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedIndex: selectedIndex,
      correctAnswer: currentQuestion.correctAnswer,
      result: "correct",
      explanation: currentQuestion.explanation
    });

    showFeedback("correct", `Correct! (+1 point). ${currentQuestion.explanation}`);
  } else {
    incorrectCount += 1;

    optionButtons[selectedIndex].classList.add("incorrect");
    optionButtons[currentQuestion.correctAnswer].classList.add("correct");

    userAnswerHistory.push({
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedIndex: selectedIndex,
      correctAnswer: currentQuestion.correctAnswer,
      result: "incorrect",
      explanation: currentQuestion.explanation
    });

    showFeedback("incorrect", `Incorrect. ${currentQuestion.explanation}`);
  }

  // Disable all buttons to prevent duplicate selections
  optionButtons.forEach((btn) => {
    btn.disabled = true;
  });

  // Show Next Question button
  nextBtn.classList.remove("hidden");
  nextBtn.removeAttribute("hidden");
}

/**
 * Displays immediate visual feedback, banner alert, and bottom explanation.
 * @param {"correct"|"incorrect"|"timeout"} type
 * @param {string} message
 */
function showFeedback(type, message) {
  // Update standard inline feedback message (for test compatibility)
  feedbackMessageEl.className = `feedback-message feedback-${type}`;
  feedbackMessageEl.textContent = message;
  feedbackMessageEl.classList.remove("hidden");

  // Update top atmospheric banner matching reference
  if (feedbackTopBanner && bannerTitle && bannerSubtitle) {
    feedbackTopBanner.className = `feedback-top-banner banner-${type}`;
    feedbackTopBanner.classList.remove("hidden");

    if (type === "correct") {
      bannerTitle.textContent = "BULLSEYE!";
      bannerSubtitle.textContent = "SPOT ON! YOU CRUSHED IT";
    } else if (type === "incorrect") {
      bannerTitle.textContent = "CLOSE, BUT NO";
      bannerSubtitle.textContent = "OOOPS... THIS ONE SLIPPED PAST";
    } else if (type === "timeout") {
      bannerTitle.textContent = "TIME'S UP!";
      bannerSubtitle.textContent = "-1 POINT PENALTY APPLIED";
    }
  }

  // Update bottom explanation bar matching reference
  if (bottomExplanationBar && explanationText) {
    const currentQuestion = questions[currentQuestionIndex];
    explanationText.textContent = currentQuestion.explanation;
    bottomExplanationBar.classList.remove("hidden");
    bottomExplanationBar.removeAttribute("hidden");
  }
}

/**
 * Advances to the next question or shows the results screen if quiz is complete.
 */
function nextQuestion() {
  clearAllTimers();

  currentQuestionIndex += 1;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

/**
 * Renders the results screen, final metrics, percentage, and detailed question review.
 */
function showResults() {
  clearAllTimers();

  // Hide feedback components
  if (feedbackTopBanner) feedbackTopBanner.classList.add("hidden");
  if (bottomExplanationBar) bottomExplanationBar.classList.add("hidden");

  showScreen(resultsScreen);

  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  finalScoreEl.textContent = score;
  maxScoreEl.textContent = totalQuestions;
  scorePercentageEl.textContent = `${percentage}%`;
  correctCountEl.textContent = correctCount;
  incorrectCountEl.textContent = incorrectCount;
  unansweredCountEl.textContent = unansweredCount;

  // Evaluative feedback message
  if (percentage >= 80) {
    performanceMessageEl.textContent = "Outstanding mastery! You have an excellent grasp of frontend fundamentals.";
  } else if (percentage >= 60) {
    performanceMessageEl.textContent = "Good performance! You have a solid grasp of core web development concepts.";
  } else if (percentage >= 40) {
    performanceMessageEl.textContent = "Decent effort. Review the question explanations below to strengthen your fundamentals.";
  } else {
    performanceMessageEl.textContent = "Keep practicing! Review the detailed answers below and give it another try.";
  }

  // Render question-by-question review cards
  renderReviewList();
}

/**
 * Constructs review cards for every completed question.
 */
function renderReviewList() {
  reviewContainer.innerHTML = "";

  userAnswerHistory.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = `review-card review-${item.result}`;

    const optionLetters = ["A", "B", "C", "D"];
    const userChoiceText =
      item.selectedIndex !== null
        ? `${optionLetters[item.selectedIndex]}: ${item.options[item.selectedIndex]}`
        : "None (Timed out)";

    const correctChoiceText = `${optionLetters[item.correctAnswer]}: ${item.options[item.correctAnswer]}`;

    let statusBadgeText = "Correct";
    let statusBadgeClass = "badge-correct";

    if (item.result === "incorrect") {
      statusBadgeText = "Incorrect";
      statusBadgeClass = "badge-incorrect";
    } else if (item.result === "unanswered") {
      statusBadgeText = "Timed Out";
      statusBadgeClass = "badge-unanswered";
    }

    card.innerHTML = `
      <header class="review-card-header">
        <span class="review-question-num">Question ${index + 1} of ${questions.length}</span>
        <span class="review-status-badge ${statusBadgeClass}">${statusBadgeText}</span>
      </header>
      <h3 class="review-question-text">${escapeHtml(item.question)}</h3>
      <div class="review-answer-details">
        <p class="review-user-answer">
          <strong>Your Answer:</strong> ${escapeHtml(userChoiceText)}
        </p>
        <p class="review-correct-answer">
          <strong>Correct Answer:</strong> ${escapeHtml(correctChoiceText)}
        </p>
        <p class="review-explanation">
          <strong>Explanation:</strong> ${escapeHtml(item.explanation)}
        </p>
      </div>
    `;

    reviewContainer.appendChild(card);
  });
}

/**
 * Helper to prevent XSS during dynamic HTML string interpolation.
 */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Resets the application state and begins a fresh attempt.
 */
function restartQuiz() {
  startQuiz();
}

// =============================================================================
// 6. EVENT LISTENERS & INITIALIZATION
// =============================================================================
function init() {
  // Sync welcome screen question count
  if (welcomeTotalQuestionsEl) {
    welcomeTotalQuestionsEl.textContent = questions.length;
  }

  // Start and Restart buttons
  startBtn.addEventListener("click", startQuiz);
  restartBtn.addEventListener("click", restartQuiz);
  nextBtn.addEventListener("click", nextQuestion);

  // Attach click listeners to option buttons
  optionButtons.forEach((btn, index) => {
    btn.dataset.index = index;
    btn.addEventListener("click", () => {
      checkAnswer(index);
    });
  });
}

// Run init once the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
