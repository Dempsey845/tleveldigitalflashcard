import GoogleAuth from "./components/GoogleAuth";
import SubjectSelection from "./components/SubjectSelection";
import CardContainer from "./components/CardContainer";
import PlayButton from "./components/PlayButton";
import ScoreModal from "./components/ScoreModal";
import { useAuth } from "./hooks/useAuth";
import { useCards } from "./hooks/useCards";
import { useEffect, useState } from "react";
import { getScoreBySubjects } from "./lib/scores";
import ScoreBySubjectDisplay from "./components/ScoreBySubjectDisplay";
import IncorrectGameMode from "./components/IncorrectGameMode";
import Logo from "./components/Logo";
import "./App.css";

function App() {
  const { user } = useAuth();
  const userId = user?.uid;

  const {
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
    hasPlayed,
  } = useCards(userId);

  const [hasSelection, setHasSelection] = useState(true);
  const [gameIsStarting, setGameIsStarting] = useState(false);
  const [scoreBySubject, setScoreBySubject] = useState({});
  const [totalScore, setTotalScore] = useState({ correct: 0, total: 0 });
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [totalCardsBySubject, setTotalCardsBySubject] = useState({});

  // When selectedCards is modified, calculate the total amount of cards by subject
  useEffect(() => {
    const totals = selectedCards.reduce((acc, card) => {
      acc[card.subject] = (acc[card.subject] || 0) + 1;
      return acc;
    }, {});
    setTotalCardsBySubject(totals);
  }, [selectedCards]);

  // When user logs in, fetch the inital scores and store it in the scoreBySubject
  useEffect(() => {
    const fetchInitialScores = async () => {
      if (!userId) return;
      const scores = await getScoreBySubjects(userId);
      if (scores) {
        setScoreBySubject(scores);

        const total = Object.values(scores).reduce(
          (acc, subj) => ({
            correct: acc.correct + subj.correct,
            total: acc.total + subj.total,
          }),
          { correct: 0, total: 0 }
        );
        setTotalScore(total);
      }
    };
    fetchInitialScores();
  }, [userId]);

  // Detect when the user finishes playing, show the score modal
  useEffect(() => {
    if (playing === false && hasPlayed) {
      setGameIsStarting(false);
      openScoreModal();
    }
  }, [playing, hasPlayed]);

  const openScoreModal = () => setShowScoreModal(true);
  const clearScores = () => {
    setScoreBySubject({});
    setTotalScore({ correct: 0, total: 0 });
  };
  const closeScoreModal = () => {
    setShowScoreModal(false);
    clearScores();
  };

  return (
    <div className="app-container">
      <Logo />

      {/* Main Game Area */}
      {user ? (
        <main className="main-game-container">
          {showScoreModal && (
            <ScoreModal
              scoreBySubject={scoreBySubject}
              totalScore={totalScore}
              onClose={closeScoreModal}
              userId={userId}
            />
          )}

          {/* Selection + Play Button */}
          <div className="selection-container">
            <SubjectSelection
              subjects={subjects}
              setSubjects={setSubjects}
              setHasSelection={setHasSelection}
              gameIsStarting={gameIsStarting}
            />
            <PlayButton
              show={!playing}
              hasSelection={hasSelection}
              startGame={() => {
                clearScores();
                startGame();
              }}
              setPlaying={setPlaying}
              setGameIsStarting={setGameIsStarting}
            />
          </div>

          {/* Card Container */}
          <div className="card-container">
            <CardContainer
              cards={selectedCards}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              nextQuestion={nextQuestion}
              playing={playing}
              setPlaying={setPlaying}
              handleIncorrect={handleIncorrect}
              handleCorrect={handleCorrect}
              resetTrigger={resetTrigger}
              setScoreBySubject={setScoreBySubject}
              setTotalScore={setTotalScore}
              openScoreModal={openScoreModal}
              totalCardsBySubject={totalCardsBySubject}
            />
          </div>

          {/* Scores Display */}
          <div className="w-full">
            <ScoreBySubjectDisplay userId={userId} updateOn={showScoreModal} />
          </div>

          <hr></hr>

          <IncorrectGameMode userId={userId} />
        </main>
      ) : (
        <p className="warning-text">Please sign in to play the game.</p>
      )}

      {/* Footer / Google Auth */}
      <footer>
        <GoogleAuth />
        {user ? (
          <p>
            Signed in as {user.displayName} ({user.email})
          </p>
        ) : (
          <p>Not signed in</p>
        )}
      </footer>
    </div>
  );
}

export default App;
