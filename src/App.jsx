import Card from "./components/Card";
import { useEffect, useState } from "react";
import CardContainer from "./components/CardContainer";
import subjectData from "./subjects.json";
import SubjectSelection from "./components/SubjectSelection";

const _questions = [
  "What is the word for when you can't break down the problem any further?",
  "What does IDE stand for?",
];
const _answers = ["Atomic", "Integrated Development Enviroment"];

function App() {
  // CardContainer
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState(0);

  const nextQuestion = () => {
    const nextQuestionIndex =
      question == _questions.length - 1 ? 0 : question + 1;
    const nextAnswerIndex = answer == _answers.length - 1 ? 0 : answer + 1;

    setQuestion(nextQuestionIndex);
    setAnswer(nextAnswerIndex);
  };

  // SubjectSelection
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const subjectNames = Object.keys(subjectData);
  const [subjects, setSubjects] = useState(
    subjectNames.map((subject) => {
      return {
        subject: subject,
        selected: true,
        answer: subjectData[subject][0].answer,
        question: subjectData[subject][0].question,
      };
    })
  );

  useEffect(() => {
    const selectedSubjects = subjects.filter((subject) => subject.selected);
    setSelectedQuestions(selectedSubjects.map((item) => item.question));
    setSelectedAnswers(selectedSubjects.map((item) => item.answer));
  }, [subjects]);

  return (
    <>
      <SubjectSelection subjects={subjects} setSubjects={setSubjects} />
      <CardContainer
        questions={selectedQuestions}
        question={question}
        answers={selectedAnswers}
        answer={answer}
        nextQuestion={nextQuestion}
      />
    </>
  );
}

export default App;
