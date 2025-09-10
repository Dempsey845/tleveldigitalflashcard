import Card from "./components/Card";
import { useEffect, useState } from "react";
import CardContainer from "./components/CardContainer";
import subjectData from "./subjects.json";
import SubjectSelection from "./components/SubjectSelection";

function App() {
  const [playing, setPlaying] = useState(false);

  // CardContainer
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState(0);

  // SubjectSelection
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const subjectNames = Object.keys(subjectData);
  const [subjects, setSubjects] = useState(
    subjectNames.map((subject) => {
      return {
        subject: subject,
        selected: true,
        values: subjectData[subject],
      };
    })
  );

  useEffect(() => {
    const selectedSubjects = subjects.filter((subject) => subject.selected);

    const questions = selectedSubjects.flatMap((subject) =>
      subject.values.map((item) => item.question)
    );

    const answers = selectedSubjects.flatMap((subject) =>
      subject.values.map((item) => item.answer)
    );

    setSelectedQuestions(questions);
    setSelectedAnswers(answers);
  }, [subjects]);

  const nextQuestion = () => {
    setSelectedQuestions((prev) => {
      const newQuestions = prev.filter((_, i) => i !== question);
      if (newQuestions.length <= 0) setPlaying(false);
      return newQuestions;
    });
    setSelectedAnswers((prev) => prev.filter((_, i) => i != answer));

    const nextQuestionIndex =
      question == selectedQuestions.length - 1 ? 0 : question + 1;
    const nextAnswerIndex =
      answer == selectedAnswers.length - 1 ? 0 : answer + 1;

    setQuestion(nextQuestionIndex);
    setAnswer(nextAnswerIndex);
  };

  return (
    <>
      <SubjectSelection
        subjects={subjects}
        setSubjects={setSubjects}
        playing={playing}
        setPlaying={setPlaying}
      />
      <CardContainer
        questions={selectedQuestions}
        question={question}
        answers={selectedAnswers}
        answer={answer}
        nextQuestion={nextQuestion}
        playing={playing}
        setPlaying={setPlaying}
      />
    </>
  );
}

export default App;
