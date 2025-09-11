import GoogleAuth from "./components/GoogleAuth";
import SubjectSelection from "./components/SubjectSelection";
import CardContainer from "./components/CardContainer";
import PlayButton from "./components/PlayButton";
import { useAuth } from "./hooks/useAuth";
import { useCards } from "./hooks/useCards";
import logo from "./assets/logo.svg";
import { useEffect, useState } from "react";

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
  } = useCards(userId);

  const [hasSelection, setHasSelection] = useState(true);
  const [gameIsStarting, setGameIsStarting] = useState(false);

  useEffect(() => {
    if (playing == false) {
      setGameIsStarting(false);
    }
  }, [playing]);

  return (
    <div className="h-lvh flex flex-col items-center">
      {/* Logo */}
      <div>
        <img src={logo} alt="Game Logo" className="w-64 sm:w-40 md:w-80" />
      </div>

      {/* Game content */}
      {user ? (
        <div className="flex flex-col justify-baseline items-center h-10/12">
          <SubjectSelection
            subjects={subjects}
            setSubjects={setSubjects}
            setHasSelection={setHasSelection}
            gameIsStarting={gameIsStarting}
          />
          <PlayButton
            show={!playing}
            hasSelection={hasSelection}
            startGame={startGame}
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
          />
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
