export default function SubjectSelection({ subjects, setSubjects }) {
  return (
    <>
      {subjects.map((subject, index) => {
        return (
          <p
            className={`${subject.selected ? "text-green-500" : "text-black"}`}
            onClick={() => {
              setSubjects((prev) =>
                prev.map((subject, i) =>
                  i === index
                    ? { ...subject, selected: !subject.selected }
                    : subject
                )
              );
            }}
            key={subject.subject}
          >
            {subject.subject}
          </p>
        );
      })}
    </>
  );
}
