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
  setScoreBySubject,
  setTotalScore,
  openScoreModal,
}) {
  const [flipped, setFlipped] = useState(false);
  const [moveToNextQuestion, setMoveToNextQuestion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [canClickStopButton, setCanClickStopButton] = useState(true);

  const currentCard = cards[currentIndex];

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
          return prev; // keep last index to show final card if needed
        }

        return next;
      });

      setFlipped(false);
      setMoveToNextQuestion(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [moveToNextQuestion, cards.length, setCurrentIndex, setPlaying]);

  if (!mounted || !currentCard) return null;

  const updateScores = (isCorrect) => {
    const subject = currentCard.subject;
    console.log("Current card:", currentCard);

    // Update subject score
    setScoreBySubject((prev) => ({
      ...prev,
      [subject]: {
        correct: (prev[subject]?.correct || 0) + (isCorrect ? 1 : 0),
        total: (prev[subject]?.total || 0) + 1,
      },
    }));

    // Update total score
    setTotalScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  return (
    <div
      className={`flex flex-col gap-5 items-center justify-center m-3
        transition-all duration-500
        ${
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <button
        disabled={!canClickStopButton}
        onClick={async () => {
          const MAX_CARDS_TO_ADD_TO_REMAINING = 10;
          const MIN_CARDS_COMPLETED_TO_ADD_TO_REMAINING = 5;

          if (currentIndex > MIN_CARDS_COMPLETED_TO_ADD_TO_REMAINING) {
            const remainingCards = cards.slice(currentIndex);

            let counter = 0;

            for (const card of remainingCards) {
              // Only mark if not already incorrect
              if (!card.incorrect && counter < MAX_CARDS_TO_ADD_TO_REMAINING) {
                counter++;
                setCanClickStopButton(false);
                await handleIncorrect(card);
              }
            }
            setCanClickStopButton(true);
          }

          // Stop the game and show modal
          setPlaying(false);
          openScoreModal();
        }}
        className="btn btn-incorrect my-2 disabled:cursor-not-allowed"
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

      <p className="text-sm text-white mt-2">
        Cards left: {cards.length - currentIndex - 1}
      </p>

      <div
        className={`buttons flex items-center justify-center transition-opacity duration-300 ${
          flipped ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          disabled={!flipped}
          onClick={() => {
            updateScores(true);
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
          disabled={!flipped}
          onClick={() => {
            updateScores(false);
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
