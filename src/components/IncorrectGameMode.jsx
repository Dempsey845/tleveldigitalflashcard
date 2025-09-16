import { useEffect, useState } from "react";
import {
  fetchAllCards,
  fetchIncorrectCards,
  markCardCorrect,
  markCardIncorrect,
} from "../lib/cards";
import Card from "./Card";

import "./styles/IncorrectGameMode.css";

export default function IncorrectGameMode({ userId }) {
  const [allCards, setAllCards] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [moveToNextQuestion, setMoveToNextQuestion] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const [cardVisible, setCardVisible] = useState(false);
  const [startScreenVisible, setStartScreenVisible] = useState(true);
  const [gameOverVisible, setGameOverVisible] = useState(false);

  useEffect(() => {
    const fetchCardsAndIncorrect = async () => {
      const fetchedCards = await fetchAllCards();
      setAllCards(fetchedCards);

      const incorrectCardIds = await fetchIncorrectCards(userId);
      const incorrectSet = new Set(incorrectCardIds.map((c) => c.cardId));
      const incorrectCards = fetchedCards.filter((card) =>
        incorrectSet.has(card.id)
      );
      setCards(incorrectCards);
    };

    fetchCardsAndIncorrect();
  }, [userId]);

  const loadIncorrectCards = async () => {
    if (!allCards) return 0;

    const incorrectCardIds = await fetchIncorrectCards(userId);
    const incorrectSet = new Set(incorrectCardIds.map((c) => c.cardId));
    const allIncorrectCards = allCards.filter((card) =>
      incorrectSet.has(card.id)
    );

    setCards(allIncorrectCards);
    setCurrentIndex(0);
    setResetTrigger((t) => !t);
    setFlipped(false);
    setMoveToNextQuestion(false);
    setButtonEnabled(true);

    return allIncorrectCards.length;
  };

  const handleCorrect = () => markCardCorrect(userId, cards[currentIndex].id);
  const handleInCorrect = () =>
    markCardIncorrect(userId, cards[currentIndex].id);

  const handleNext = () => {
    setCardVisible(false);
    if (currentIndex < cards.length - 1) {
      setMoveToNextQuestion(true);
      setButtonEnabled(false);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setFlipped(false);
        setMoveToNextQuestion(false);
        setButtonEnabled(true);
        setCardVisible(true);
      }, 400);
    } else {
      setTimeout(() => {
        setGameOver(true);
        setGameOverVisible(true);
      }, 400);
    }
  };

  const startGame = async () => {
    setStartScreenVisible(false);
    setTimeout(async () => {
      const count = await loadIncorrectCards();
      if (count === 0) return;
      setGameStarted(true);
      setCardVisible(true);
    }, 400);
  };

  const restartGame = async () => {
    setCardVisible(false);
    setGameOverVisible(false);
    setGameOver(false);
    setStartScreenVisible(false);

    setTimeout(async () => {
      const count = await loadIncorrectCards();
      if (count === 0) {
        setGameStarted(false);
        return;
      }
      setGameStarted(true);
      setCardVisible(true);
    }, 400);
  };

  if (!allCards) return <p className="loading">Loading cards...</p>;

  return (
    <div className="game-container">
      <h2 className="title">Incorrect Cards</h2>

      {/* Start Screen */}
      {!gameStarted && startScreenVisible && cards.length > 0 && (
        <div className={`start-screen ${startScreenVisible ? "show" : "hide"}`}>
          <p className="description">Ready to practise your incorrect cards?</p>
          <button onClick={startGame} className="btn primary">
            Start Game
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && gameOverVisible && (
        <div className={`game-over ${gameOverVisible ? "show" : "hide"}`}>
          <h3 className="game-complete">🎉 Game Complete!</h3>
          <p className="description">
            You’ve gone through all your incorrect cards.
          </p>
          <button onClick={restartGame} className="btn primary">
            Restart
          </button>
        </div>
      )}

      {/* Game Active */}
      {gameStarted && !gameOver && cards.length > 0 && (
        <>
          <div className={`card-wrapper ${cardVisible ? "show" : "hide"}`}>
            <Card
              key={cards[currentIndex].id}
              question={cards[currentIndex].question}
              answer={cards[currentIndex].answer}
              flipped={flipped}
              setFlipped={setFlipped}
              moveToNextQuestion={moveToNextQuestion}
              setMoveToNextQuestion={setMoveToNextQuestion}
              resetTrigger={resetTrigger}
            />
          </div>

          <p className="progress">
            Card {currentIndex + 1} of {cards.length}
          </p>

          <div className={`answer-buttons ${flipped ? "show" : "hide"}`}>
            <button
              disabled={!flipped || !buttonEnabled}
              onClick={() => {
                handleCorrect();
                handleNext();
              }}
              className="btn correct"
            >
              Correct
            </button>

            <button
              disabled={!flipped || !buttonEnabled}
              onClick={() => {
                handleInCorrect();
                handleNext();
              }}
              className="btn incorrect"
            >
              Incorrect
            </button>
          </div>
        </>
      )}

      {/* No incorrect cards */}
      {!gameStarted && cards.length === 0 && (
        <p className="no-cards">No incorrect cards found 🎉</p>
      )}
    </div>
  );
}
