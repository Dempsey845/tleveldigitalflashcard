import GoogleAuth from "./components/GoogleAuth";
import SubjectSelection from "./components/SubjectSelection";
import CardContainer from "./components/CardContainer";
import { useAuth } from "./hooks/useAuth";
import { useCards } from "./hooks/useCards";

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

  return (
    <>
      <div className="p-6">
        <GoogleAuth />
        {user ? (
          <p className="mt-4">
            Signed in as {user.displayName} ({user.email})
          </p>
        ) : (
          <p className="mt-4">Not signed in</p>
        )}
      </div>

      {user ? (
        <>
          <SubjectSelection
            subjects={subjects}
            setSubjects={setSubjects}
            playing={playing}
            setPlaying={setPlaying}
            startGame={startGame}
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
        </>
      ) : (
        <p className="p-6 text-center text-red-500">
          Please sign in to play the game.
        </p>
      )}
    </>
  );
}

export default App;
