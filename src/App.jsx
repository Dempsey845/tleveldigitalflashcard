import Card from "./components/Card";
import { useState } from "react";

const questions = [
  "What is the word for when you can't break down the problem any further?",
  "What does IDE stand for?",
];
const answers = ["Atomic", "Integrated Development Enviroment"];

function App() {
  const [flipped, setFlipped] = useState(false);
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState(0);
  const [moveToNextQuestion, setMoveToNextQuestion] = useState(false);

  const nextQuestion = () => {
    const nextQuestionIndex =
      question == questions.length - 1 ? 0 : question + 1;
    const nextAnswerIndex = answer == answers.length - 1 ? 0 : answer + 1;

    setQuestion(nextQuestionIndex);
    setAnswer(nextAnswerIndex);
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center m-3">
      <Card
        question={questions[question]}
        answer={answers[answer]}
        flipped={flipped}
        setFlipped={setFlipped}
        moveToNextQuestion={moveToNextQuestion}
        setMoveToNextQuestion={setMoveToNextQuestion}
        nextQuestion={nextQuestion}
      />

      <div className={`buttons ${flipped ? "visible" : ""}`}>
        <button
          onClick={() => {
            setMoveToNextQuestion(true);
            setFlipped(false);
          }}
          className="btn btn-correct"
        >
          Correct
        </button>
        <p className="mx-2 select-none">Was your answer correct?</p>
        <button className="btn btn-incorrect">Incorrect</button>
      </div>
    </div>
  );
}

export default App;
