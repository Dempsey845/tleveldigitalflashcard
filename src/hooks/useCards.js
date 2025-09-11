import { useEffect, useState } from "react";
import {
  fetchAllCards,
  markCardIncorrect,
  fetchIncorrectCards,
  markCardCorrect,
} from "../lib/cards";

export function useCards(userId) {
  const [subjects, setSubjects] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);

  const [incorrectCardIds, setIncorrectCardIds] = useState([]);

  // Fetch all cards and user's incorrect cards
  useEffect(() => {
    async function loadCards() {
      const cards = await fetchAllCards();

      // Fetch user's incorrect cards
      let userIncorrectIds = [];
      if (userId) {
        const incorrectCards = await fetchIncorrectCards(userId);
        userIncorrectIds = incorrectCards.map((c) => c.id);
        setIncorrectCardIds(userIncorrectIds);
      }

      // Group by subject for selection
      const grouped = cards.reduce((acc, card) => {
        if (!acc[card.subject]) acc[card.subject] = [];
        acc[card.subject].push({
          id: card.id,
          question: card.question,
          answer: card.answer,
          incorrect: userIncorrectIds.includes(card.id),
        });
        return acc;
      }, {});

      setSubjects(
        Object.keys(grouped).map((subject) => ({
          subject,
          selected: true,
          cards: grouped[subject],
        }))
      );
    }

    loadCards();
  }, [userId]);

  // Start the game
  const startGame = () => {
    const selectedSubjects = subjects.filter((subj) => subj.selected);
    let cards = selectedSubjects.flatMap((subj) => subj.cards);

    // Remove duplicates
    const uniqueCardsMap = {};
    cards.forEach((card) => {
      if (!uniqueCardsMap[card.id]) uniqueCardsMap[card.id] = card;
    });
    cards = Object.values(uniqueCardsMap);

    // Sort incorrect cards first based on current state
    cards.sort((a, b) => {
      const aIncorrect = incorrectCardIds.includes(a.id);
      const bIncorrect = incorrectCardIds.includes(b.id);

      if (aIncorrect && !bIncorrect) return -1;
      if (!aIncorrect && bIncorrect) return 1;
      return 0;
    });

    setSelectedCards(cards);
    setCurrentIndex(0);
    setPlaying(true);

    // Trigger card reset
    setResetTrigger((prev) => !prev);
  };

  // Go to next question
  const nextQuestion = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= selectedCards.length) {
        setPlaying(false);
        return prevIndex;
      }
      return nextIndex;
    });
  };

  // Mark current card as incorrect
  const handleIncorrect = async () => {
    if (!selectedCards.length || !userId) return;

    const currentCard = selectedCards[currentIndex];
    await markCardIncorrect(userId, currentCard.id);

    setIncorrectCardIds((prev) => [...prev, currentCard.id]);

    // Update locally
    setSelectedCards((prev) =>
      prev.map((card) =>
        card.id === currentCard.id ? { ...card, incorrect: true } : card
      )
    );
  };

  // Mark current card as correct
  const handleCorrect = async () => {
    if (!selectedCards.length || !userId) return;

    const currentCard = selectedCards[currentIndex];
    await markCardCorrect(userId, currentCard.id);

    setIncorrectCardIds((prev) => prev.filter((id) => id !== currentCard.id));

    // Update locally
    setSelectedCards((prev) =>
      prev.map((card) =>
        card.id === currentCard.id ? { ...card, incorrect: false } : card
      )
    );
  };

  return {
    subjects,
    setSubjects,
    selectedCards,
    currentIndex,
    setCurrentIndex,
    playing,
    setPlaying,
    nextQuestion,
    handleIncorrect,
    handleCorrect,
    startGame,
    resetTrigger,
  };
}
