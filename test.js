const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== Testing Task 19: Quiz Application ===\n");

// 1. Read files
const htmlContent = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const scriptContent = fs.readFileSync(path.join(__dirname, "script.js"), "utf8");

// 2. Verify Selectors between index.html and script.js
console.log("Test 1: Verifying DOM Selectors match...");
const requiredIds = [
  "welcome-screen",
  "quiz-screen",
  "results-screen",
  "welcome-total-questions",
  "start-btn",
  "current-question-num",
  "total-questions-num",
  "timer-display",
  "current-score",
  "progress-bar-fill",
  "question-text",
  "options-container",
  "feedback-message",
  "next-btn",
  "final-score",
  "max-score",
  "score-percentage",
  "correct-count",
  "incorrect-count",
  "unanswered-count",
  "performance-message",
  "review-container",
  "restart-btn"
];

for (const id of requiredIds) {
  assert(
    htmlContent.includes(`id="${id}"`),
    `Missing id="${id}" in index.html`
  );
  assert(
    scriptContent.includes(`"${id}"`) || scriptContent.includes(`'${id}'`),
    `script.js should reference element id="${id}"`
  );
}
console.log("✔ Test 1 Passed: All 23 required DOM selectors match index.html exactly.\n");

// 3. Verify Question Array Structure
console.log("Test 2: Verifying Question Array requirements...");
// Extract questions array from script
const questionsMatch = scriptContent.match(/const questions = (\[[\s\S]*?\n\]);/);
assert(questionsMatch, "Could not find questions array in script.js");

const questions = eval(questionsMatch[1]);
assert(Array.isArray(questions), "questions should be an array");
assert(questions.length >= 10, `Expected at least 10 questions, found ${questions.length}`);

questions.forEach((q, idx) => {
  assert(typeof q.question === "string" && q.question.length > 5, `Question ${idx + 1} has invalid question prompt`);
  assert(Array.isArray(q.options) && q.options.length === 4, `Question ${idx + 1} must have exactly 4 choices`);
  assert(typeof q.correctAnswer === "number" && q.correctAnswer >= 0 && q.correctAnswer <= 3, `Question ${idx + 1} has invalid correctAnswer index`);
  assert(typeof q.explanation === "string" && q.explanation.length > 5, `Question ${idx + 1} has missing or empty explanation`);
});
console.log(`✔ Test 2 Passed: Found ${questions.length} properly structured multiple-choice questions.\n`);

// 4. Verify Required Functions exist in script.js
console.log("Test 3: Verifying Required Functions exist...");
const requiredFunctions = [
  "startQuiz",
  "showQuestion",
  "checkAnswer",
  "startTimer",
  "handleTimeout",
  "showFeedback",
  "nextQuestion",
  "showResults",
  "restartQuiz"
];

for (const fn of requiredFunctions) {
  assert(
    scriptContent.includes(`function ${fn}`) || scriptContent.includes(`const ${fn} =`),
    `Missing required function: ${fn}`
  );
}
console.log("✔ Test 3 Passed: All required functions are implemented.\n");

// 5. Verify State Variables exist in script.js
console.log("Test 4: Verifying Application State variables...");
const requiredStateKeywords = [
  "currentQuestionIndex",
  "score",
  "correctCount",
  "incorrectCount",
  "unansweredCount",
  "userAnswerHistory",
  "remainingTime",
  "isQuestionAnswered",
  "timerInterval"
];

for (const stateVar of requiredStateKeywords) {
  assert(
    scriptContent.includes(stateVar),
    `Missing state variable: ${stateVar}`
  );
}
console.log("✔ Test 4 Passed: All state variables properly declared and tracked.\n");

// 6. Verify Timer logic and timeout penalty
console.log("Test 5: Verifying Timer & Penalty Logic...");
assert(scriptContent.includes("remainingTime = 60"), "Timer must be initialized to 60 seconds");
assert(scriptContent.includes("score -= 1"), "Timer expiration must deduct one point (-1)");
assert(scriptContent.includes("score += 1"), "Correct answer must increase score by 1");
console.log("✔ Test 5 Passed: Timer duration (60s), correct increment (+1), and timeout penalty (-1) verified.\n");

console.log("All Task 19 automated verification tests passed successfully!");
