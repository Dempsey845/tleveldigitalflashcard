import GoogleAuth from "./components/GoogleAuth";
import SubjectSelection from "./components/SubjectSelection";
import CardContainer from "./components/CardContainer";
import PlayButton from "./components/PlayButton";
import ScoreModal from "./components/ScoreModal";
import { useAuth } from "./hooks/useAuth";
import { useCards } from "./hooks/useCards";
import logo from "./assets/logo.svg";
import { useEffect, useState } from "react";
import { getScoreBySubjects } from "./lib/scores";
import ScoreBySubjectDisplay from "./components/ScoreBySubjectDisplay";

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
    <div className="min-h-screen flex flex-col items-center">
      {/* Logo */}
      <header className="py-6">
        <img
          src={logo}
          alt="Game Logo"
          className="mx-auto w-56 sm:w-64 md:w-96 lg:w-[28rem] transition-all duration-500 ease-in-out"
        />
      </header>

      {/* Main Game Area */}
      {user ? (
        <main className="flex flex-col flex-1 w-full max-w-3xl px-4 sm:px-6 md:px-8 gap-6">
          {showScoreModal && (
            <ScoreModal
              scoreBySubject={scoreBySubject}
              totalScore={totalScore}
              onClose={closeScoreModal}
              userId={userId}
            />
          )}

          {/* Selection + Play Button */}
          <div className="flex flex-col md:justify-between items-center gap-4">
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
          <div className="flex-1 w-full overflow-y-auto">
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
            />
          </div>

          {/* Scores Display */}
          <div className="w-full">
            <ScoreBySubjectDisplay userId={userId} updateOn={showScoreModal} />
          </div>
        </main>
      ) : (
        <p className="p-6 text-center text-red-500">
          Please sign in to play the game.
        </p>
      )}

      {/* Footer / Google Auth */}
      <footer className="p-6 flex flex-col items-center w-full shadow-inner">
        <GoogleAuth />
        {user ? (
          <p className="mt-4 text-center">
            Signed in as {user.displayName} ({user.email})
          </p>
        ) : (
          <p className="mt-4 text-center">Not signed in</p>
        )}
      </footer>
    </div>
  );
}

export default App;
