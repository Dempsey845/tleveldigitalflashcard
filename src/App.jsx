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

  const openScoreModal = () => {
    setShowScoreModal(true);
  };

  const clearScores = () => {
    setScoreBySubject({});
    setTotalScore({ correct: 0, total: 0 });
  };

  const closeScoreModal = () => {
    setShowScoreModal(false);
    clearScores();
  };

  return (
    <div className="h-lvh flex flex-col items-center">
      {/* Logo */}
      <div>
        <img src={logo} alt="Game Logo" className="w-64 sm:w-40 md:w-80" />
      </div>

      {/* Game content */}
      {user ? (
        <div className="flex flex-col justify-baseline items-center h-10/12">
          {showScoreModal && (
            <ScoreModal
              scoreBySubject={scoreBySubject}
              totalScore={totalScore}
              onClose={() => closeScoreModal()}
              userId={userId}
            />
          )}
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
          <ScoreBySubjectDisplay userId={userId} updateOn={showScoreModal} />
        </div>
      ) : (
        <p className="p-6 text-center text-red-500">
          Please sign in to play the game.
        </p>
      )}

      {/* Google auth */}
      <div className="p-6 flex flex-col w-full justify-center items-center">
        <GoogleAuth />
        {user ? (
          <p className="mt-4">
            Signed in as {user.displayName} ({user.email})
          </p>
        ) : (
          <p className="mt-4">Not signed in</p>
        )}
      </div>
    </div>
  );
}

export default App;
