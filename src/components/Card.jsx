import { useEffect, useRef } from "react";
import "./Card.css";

export default function Card({
  question,
  answer,
  flipped,
  setFlipped,
  moveToNextQuestion,
  setMoveToNextQuestion,
  nextQuestion,
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (moveToNextQuestion && cardRef.current) {
      cardRef.current.classList.add("move-up");

      const timeout = setTimeout(() => {
        cardRef.current.classList.remove("flipped");
        cardRef.current.classList.remove("move-up");

        cardRef.current.classList.add("move-down");

        nextQuestion();

        setTimeout(() => {
          cardRef.current.classList.remove("move-down");
          setMoveToNextQuestion(false);
        }, 500);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [moveToNextQuestion]);

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
