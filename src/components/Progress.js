function Progress({index, numberOfQuestions, points, answer, totalPoints}) {
  return <header className="progress">
    <progress max={numberOfQuestions} value={index + Number(answer !== null)}/>
    <p>
        Question <strong>{index + 1}</strong> / {numberOfQuestions}
    </p>
    <p>
        {points} / {totalPoints}
    </p>

  </header>;
}

export default Progress;
