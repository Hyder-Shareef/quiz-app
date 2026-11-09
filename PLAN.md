# Task 19: Browser-Based Multiple-Choice Quiz Application — Architecture & Specification

## 1. Executive Summary & Objective

The objective of this task is to implement a robust, interactive, accessible **Multiple-Choice Quiz Application** using **HTML5, CSS3, and Vanilla ES6 JavaScript**.

Key features and requirements:
1. **Welcome Screen:** Title, description, question count badge, and "Start Quiz" button.
2. **Question Card:** One question displayed at a time with 4 choices.
3. **Immediate Feedback:** Green for correct answers, red for incorrect answers, and revelation of the correct answer on every attempt with explanatory context.
4. **Scoring System:** +1 point for correct answers, -1 point penalty for expired timers.
5. **Per-Question Countdown Timer:** 60-second timer per question that updates each second and auto-advances upon expiration.
6. **Results Screen:** Final score, percentage, correct/incorrect/unanswered counts, performance appraisal, and comprehensive review of each question.
7. **Restart Functionality:** Resets all state and begins a fresh attempt.

---

## 2. Directory Layout

```text
task19/
├── index.html        # Semantic HTML5 layout with 3 discrete screens
├── style.css         # Modern, accessible styling with feedback tokens
├── script.js         # Vanilla ES6 logic, state management, timer, and review generation
├── test.js           # Automated verification test suite
├── PLAN.md           # Specification and architecture document
└── explanation.md    # Beginner-friendly step-by-step code guide
```

---

## 3. Application State

```javascript
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
```

---

## 4. Key Functions

- `startQuiz()`: Resets application state and loads the first question.
- `showQuestion()`: Renders question, options, progress, and initializes timer.
- `startTimer()`: Starts a 60-second countdown; updates display every second.
- `checkAnswer(selectedIndex)`: Validates selected option, updates score and stats, displays feedback and explanation.
- `handleTimeout()`: Applies -1 penalty, disables options, reveals correct choice, and advances.
- `showFeedback(type, message)`: Sets visual message alert and tone.
- `nextQuestion()`: Advances to next question or triggers results view.
- `showResults()`: Calculates final percentage and builds detailed review.
- `restartQuiz()`: Resets state and begins fresh quiz attempt.
