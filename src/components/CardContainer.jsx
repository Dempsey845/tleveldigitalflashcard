import { useState, useEffect } from "react";
import Card from "./Card";

export default function CardContainer({
  questions,
  question,
  answers,
  answer,
  nextQuestion,
  playing,
  setPlaying,
}) {
  const [flipped, setFlipped] = useState(false);
  const [moveToNextQuestion, setMoveToNextQuestion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (playing) {
      setMounted(true);
      // allow a tick for the element to mount before animating in
      const tick = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(tick);
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [playing]);

  if (!mounted) return null;

  return (
    <div
      className={`flex flex-col gap-5 items-center justify-center m-3
        transition-all duration-500
        ${
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <Card
        question={questions[question]}
        answer={answers[answer]}
        flipped={flipped}
        setFlipped={setFlipped}
        moveToNextQuestion={moveToNextQuestion}
        setMoveToNextQuestion={setMoveToNextQuestion}
        nextQuestion={nextQuestion}
      />

      <div
        className={`buttons flex items-center justify-center transition-opacity duration-300 ${
          flipped ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => {
            setMoveToNextQuestion(true);
            setFlipped(false);
          }}
          className="btn btn-correct flex-shrink-0"
        >
          Correct
        </button>

        <p className="mx-2 select-none flex-shrink text-center">
          Was your answer correct?
        </p>

        <button className="btn btn-incorrect flex-shrink-0">Incorrect</button>
      </div>

      <button
        onClick={() => setPlaying(false)}
        className="btn btn-incorrect my-10"
      >
        Stop
      </button>
    </div>
  );
}
