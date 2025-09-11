import { useEffect, useState } from "react";
import { fetchAllCards } from "../lib/cards";

export function useCards() {
  const [subjects, setSubjects] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Fetch and group cards by subject
  useEffect(() => {
    async function loadCards() {
      const cards = await fetchAllCards();

      const grouped = cards.reduce((acc, card) => {
        if (!acc[card.subject]) acc[card.subject] = [];
        acc[card.subject].push({
          id: card.id,
          question: card.question,
          answer: card.answer,
        });
        return acc;
      }, {});

      const subjectNames = Object.keys(grouped);
      setSubjects(
        subjectNames.map((subject) => ({
          subject,
          selected: true,
          cards: grouped[subject],
        }))
      );
    }

    loadCards();
  }, []);

  // Build selectedCards whenever subjects change
  useEffect(() => {
    if (!subjects.length) return;

    const selectedSubjects = subjects.filter((subject) => subject.selected);
    const cards = selectedSubjects.flatMap((subject) => subject.cards);

    setSelectedCards(cards);
    setCurrentIndex(0);
  }, [subjects]);

  // Go to next question
  const nextQuestion = () => {
    if (selectedCards.length === 0) {
      setPlaying(false);
      return;
    }

    const currentCardId = selectedCards[currentIndex].id;

    setSelectedCards((prev) =>
      prev.filter((card) => card.id !== currentCardId)
    );

    setCurrentIndex((prevIndex) =>
      prevIndex >= selectedCards.length - 1 ? 0 : prevIndex
    );

    if (selectedCards.length === 1) setPlaying(false);
  };

  return {
    subjects,
    setSubjects,
    selectedCards,
    currentIndex,
    playing,
    setPlaying,
    nextQuestion,
  };
}
