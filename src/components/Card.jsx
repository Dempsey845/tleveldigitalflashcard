import { useEffect, useRef } from "react";
import "./Card.css";

export default function Card({
  question,
  answer,
  flipped,
  setFlipped,
  moveToNextQuestion,
  setMoveToNextQuestion,
  resetTrigger,
}) {
  const cardRef = useRef(null);

  // Reset on game start/restart
  useEffect(() => {
    if (resetTrigger && cardRef.current) {
      cardRef.current.classList.remove("flipped", "move-up", "move-down");
      setFlipped(false);
    }
  }, [resetTrigger, setFlipped]);

  // Trigger animations when moving to next question
  useEffect(() => {
    const card = cardRef.current;
    if (!moveToNextQuestion || !card) return;

    card.classList.add("move-up");

    const timeout = setTimeout(() => {
      card.classList.remove("flipped", "move-up");
      card.classList.add("move-down");

      // Only signal that the animation is finished
      const innerTimeout = setTimeout(() => {
        card.classList.remove("move-down");
        setMoveToNextQuestion(false);
      }, 500);

      return () => clearTimeout(innerTimeout);
    }, 500);

    return () => clearTimeout(timeout);
  }, [moveToNextQuestion, setMoveToNextQuestion]);

  return (
    <div
      ref={cardRef}
      className={`card cwidth ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="card-inner">
        <div className="card-face card-front">
          <p>{question}</p>
        </div>
        <div className="card-face card-back">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
