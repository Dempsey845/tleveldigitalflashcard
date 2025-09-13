import { useEffect, useState } from "react";
import {
  fetchAllCards,
  fetchIncorrectCards,
  markCardCorrect,
  markCardIncorrect,
} from "../lib/cards";
import Card from "./Card";

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

  // Fetch all cards and incorrect cards on mount
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
    setCardVisible(false); // exit animation
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
      if (count === 0) return; // no incorrect cards
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

  if (!allCards)
    return <p className="text-center mt-8 text-gray-500">Loading cards...</p>;

  return (
    <div
      className={`game-container flex flex-col items-center justify-center p-4 overflow-hidden transition-all duration-500`}
    >
      <h2 className="text-2xl sm:text-4xl font-bold mb-6 text-indigo-800">
        Incorrect Cards
      </h2>

      {/* Start Screen */}
      {!gameStarted && startScreenVisible && cards.length > 0 && (
        <div
          className={`flex flex-col items-center justify-center text-center transition-all duration-400 ${
            startScreenVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          <p className="text-lg text-gray-700 mb-6">
            Ready to practise your incorrect cards?
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold shadow-md transition-transform duration-200"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && gameOverVisible && (
        <div
          className={`flex flex-col items-center justify-center text-center transition-all duration-400 ${
            gameOverVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-green-600 mb-4 animate-bounce">
            🎉 Game Complete!
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            You’ve gone through all your incorrect cards.
          </p>
          <button
            onClick={restartGame}
            className="px-6 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold shadow-md transition-transform duration-200"
          >
            Restart
          </button>
        </div>
      )}

      {/* Game Active */}
      {gameStarted && !gameOver && cards.length > 0 && (
        <>
          <div
            className={`transition-all duration-400 ${
              cardVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-6"
            }`}
          >
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

          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Card {currentIndex + 1} of {cards.length}
          </p>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center mt-6 gap-4 transform transition-all duration-500 ${
              flipped
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <button
              disabled={!flipped || !buttonEnabled}
              onClick={() => {
                handleCorrect();
                handleNext();
              }}
              className="px-6 py-2 rounded-2xl bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold shadow-md transition-transform duration-200 w-36"
            >
              Correct
            </button>

            <button
              disabled={!flipped || !buttonEnabled}
              onClick={() => {
                handleInCorrect();
                handleNext();
              }}
              className="px-6 py-2 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold shadow-md transition-transform duration-200 w-36"
            >
              Incorrect
            </button>
          </div>
        </>
      )}

      {/* No incorrect cards */}
      {!gameStarted && cards.length === 0 && (
        <p className="text-lg text-green-600 font-medium mt-6">
          No incorrect cards found 🎉
        </p>
      )}
    </div>
  );
}
