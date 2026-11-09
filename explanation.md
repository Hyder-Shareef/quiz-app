# Task 19: Multiple-Choice Quiz Application — Step-by-Step Explanation

This guide explains how the quiz application was architected across `index.html`, `style.css`, and `script.js`.

---

## 1. Semantic Structure (`index.html`)

The application is structured around three screen containers (`#welcome-screen`, `#quiz-screen`, and `#results-screen`).

- **Screen Toggling:** Only the active screen is visible; inactive screens carry the `hidden` class and HTML5 `hidden` boolean attribute.
- **Accessibility:**
  - Timer box uses `role="timer"` with `aria-live="polite"` and `aria-atomic="true"`.
  - Progress bar uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
  - Feedback container uses `role="alert"` and `aria-live="assertive"`.
  - Review section uses `role="feed"`.

---

## 2. Dynamic Logic & State Management (`script.js`)

### Question Data Model
Questions are stored in a JSON-compatible array of objects:
```javascript
{
  question: "What will the expression typeof NaN evaluate to in JavaScript?",
  options: ["'number'", "'NaN'", "'undefined'", "'object'"],
  correctAnswer: 0,
  explanation: "In JavaScript, NaN ('Not-a-Number') is technically a numeric data type..."
}
```

### State Variables
- `currentQuestionIndex`: Tracks the active question (0-indexed).
- `score`: Net score (+1 for correct, -1 for timeout).
- `correctCount`, `incorrectCount`, `unansweredCount`: Separate counters for reporting.
- `userAnswerHistory`: Logs each attempt with user selection, correct answer, and explanation.
- `remainingTime`: Tracks seconds remaining (starts at 60s per question).
- `isQuestionAnswered`: Guard flag preventing multiple clicks or race conditions.
- `timerInterval`: Reference to active `setInterval` cleared on navigation, timeout, or restart.

### Key Event Lifecycle
1. **Starting the Quiz:** `startBtn` triggers `startQuiz()`, which initializes counters, changes screens, and invokes `showQuestion()`.
2. **Answering a Question:** Clicking an option button invokes `checkAnswer(index)`. The timer is cleared immediately, buttons are locked, feedback is applied (`.correct` / `.incorrect`), and the "Next Question" button is revealed.
3. **Timer Expiration:** If the 60-second timer reaches 0, `handleTimeout()` deducts 1 point from score, marks the question as unanswered, highlights the correct choice, and schedules an auto-advance.
4. **Results Display:** Once all questions are completed, `showResults()` computes percentage, shows metric cards, and iterates through `userAnswerHistory` to render question-by-question review cards.
5. **Restarting:** `restartBtn` triggers `restartQuiz()`, which clears all timers, resets state to zero, and begins question 1 anew.

---

## 3. Styling & Feedback System (`style.css`)

- **Correct Selection (`.option-btn.correct`):** Background `#f0fdf4`, border `#16a34a`, text `#16a34a`.
- **Incorrect Selection (`.option-btn.incorrect`):** Background `#fef2f2`, border `#dc2626`, text `#dc2626`.
- **Timer Urgency (`.timer-warning`):** Flashes when $\le 10$ seconds remaining.
- **Review Cards (`.review-card`):** Colored border indicators based on result (`review-correct`, `review-incorrect`, `review-unanswered`).
