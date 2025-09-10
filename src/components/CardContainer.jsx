import { useState } from "react";
import Card from "./Card";

export default function CardContainer({
  questions,
  question,
  answers,
  answer,
  nextQuestion,
}) {
  const [flipped, setFlipped] = useState(false);
  const [moveToNextQuestion, setMoveToNextQuestion] = useState(false);

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
