import { useState, useEffect } from "react";
import Card from "./Card";

export default function CardContainer({
  cards,
  currentIndex,
  setCurrentIndex,
  playing,
  setPlaying,
  handleIncorrect,
  handleCorrect,
  resetTrigger,
}) {
  const [flipped, setFlipped] = useState(false);
  const [moveToNextQuestion, setMoveToNextQuestion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Mount/unmount effect
  useEffect(() => {
    if (playing) {
      setMounted(true);
      const tick = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(tick);
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [playing]);

  // Move to next card after animation
  useEffect(() => {
    if (!moveToNextQuestion) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= cards.length) {
          setPlaying(false);
          return 0;
        }
        return next;
      });
      setFlipped(false);
      setMoveToNextQuestion(false);
    }, 1000); // match animation duration
    return () => clearTimeout(timer);
  }, [moveToNextQuestion, cards.length, setCurrentIndex, setPlaying]);

  // Always render hooks first
  const currentCard = cards[currentIndex];

  // Return null safely if nothing to show
  if (!mounted || !currentCard) return null;

  return (
    <div
      className={`flex flex-col gap-5 items-center justify-center m-3
        transition-all duration-500
        ${
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <button
        onClick={() => setPlaying(false)}
        className="btn btn-incorrect my-2"
      >
        Stop
      </button>
      <Card
        question={currentCard.question}
        answer={currentCard.answer}
        flipped={flipped}
        setFlipped={setFlipped}
        moveToNextQuestion={moveToNextQuestion}
        setMoveToNextQuestion={setMoveToNextQuestion}
        resetTrigger={resetTrigger}
      />

      <div
        className={`buttons flex items-center justify-center transition-opacity duration-300 ${
          flipped ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => {
            handleCorrect();
            setMoveToNextQuestion(true);
          }}
          className="btn btn-correct flex-shrink-0"
        >
          Correct
        </button>

        <p className="mx-2 select-none flex-shrink text-center">
          Was your answer correct?
        </p>

        <button
          onClick={() => {
            handleIncorrect();
            setMoveToNextQuestion(true);
          }}
          className="btn btn-incorrect flex-shrink-0"
        >
          Incorrect
        </button>
      </div>
    </div>
  );
}
