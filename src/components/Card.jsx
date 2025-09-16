import { useEffect, useRef } from "react";
import "./styles/Card.css";

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

  // Dynamic text resizing
  const resizeText = () => {
    if (!cardRef.current) return;
    const faces = cardRef.current.querySelectorAll("p");

    faces.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;

      let fontSize = 24; // maximum font size
      const minFontSize = 12; // minimum font size
      el.style.fontSize = fontSize + "px";

      const fitText = () => {
        if (
          (el.scrollHeight > parent.clientHeight - 12 ||
            el.scrollWidth > parent.clientWidth - 12) &&
          fontSize > minFontSize
        ) {
          fontSize -= 1;
          el.style.fontSize = fontSize + "px";
          requestAnimationFrame(fitText);
        }
      };

      requestAnimationFrame(fitText);
    });
  };

  // Resize on question/answer change and card size changes
  useEffect(() => {
    resizeText();

    const resizeObserver = new ResizeObserver(() => {
      resizeText();
    });

    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [question, answer]);

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
