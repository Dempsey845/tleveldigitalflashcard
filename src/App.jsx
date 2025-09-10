import Card from "./components/Card";

function App() {
  return (
    <div className="flex items-center justify-center align-middle m-3">
      <Card
        question={
          "What is the word for when you can't break down the problem any further?"
        }
        answer={"Atomic"}
      />
    </div>
  );
}

export default App;
