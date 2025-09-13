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
  totalCardsBySubject,
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

    setScoreBySubject((prev) => ({
      ...prev,
      [subject]: {
        correct: (prev[subject]?.correct || 0) + (isCorrect ? 1 : 0),
        total: totalCardsBySubject[subject] || 0,
      },
    }));

    setTotalScore((prev) => {
      const newCorrect = prev.correct + (isCorrect ? 1 : 0);

      const newTotal = Object.values(totalCardsBySubject).reduce(
        (acc, count) => acc + count,
        0
      );

      return {
        correct: newCorrect,
        total: newTotal,
      };
    });
  };

  return (
    <div
      className={`flex flex-col items-center justify-center m-2 sm:m-3 transition-all duration-500
      ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {/* Stop Button */}
      <button
        disabled={!canClickStopButton}
        onClick={async () => {
          const MAX_CARDS_TO_ADD_TO_REMAINING = 10;
          const MIN_CARDS_COMPLETED_TO_ADD_TO_REMAINING = 5;

          if (currentIndex > MIN_CARDS_COMPLETED_TO_ADD_TO_REMAINING) {
            const remainingCards = cards.slice(currentIndex);
            let counter = 0;
            for (const card of remainingCards) {
              if (!card.incorrect && counter < MAX_CARDS_TO_ADD_TO_REMAINING) {
                counter++;
                setCanClickStopButton(false);
                await handleIncorrect(card);
              }
            }
            setCanClickStopButton(true);
          }

          setPlaying(false);
          openScoreModal();
        }}
        className="btn btn-incorrect my-2 disabled:cursor-not-allowed w-40 sm:w-48 md:w-56 text-sm sm:text-base md:text-lg"
      >
        Stop
      </button>

      {/* Card */}
      <Card
        question={currentCard.question}
        answer={currentCard.answer}
        flipped={flipped}
        setFlipped={setFlipped}
        moveToNextQuestion={moveToNextQuestion}
        setMoveToNextQuestion={setMoveToNextQuestion}
        resetTrigger={resetTrigger}
      />

      {/* Cards left */}
      <p className="text-xs sm:text-sm md:text-base text-white mt-2">
        Cards left: {cards.length - currentIndex - 1}
      </p>

      {/* Correct / Incorrect Buttons */}
      <div
        className={`buttons flex flex-row items-center justify-center mt-2 gap-2 sm:gap-4 transition-opacity duration-300 ${
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
          className="btn btn-correct w-32 sm:w-40 text-sm sm:text-base md:text-lg"
        >
          Correct
        </button>

        <p className="hidden sm:block mx-2 text-center select-none text-sm sm:text-base">
          Was your answer correct?
        </p>

        <button
          disabled={!flipped}
          onClick={() => {
            updateScores(false);
            handleIncorrect();
            setMoveToNextQuestion(true);
          }}
          className="btn btn-incorrect w-32 sm:w-40 text-sm sm:text-base md:text-lg"
        >
          Incorrect
        </button>
      </div>
    </div>
  );
}
