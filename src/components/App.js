import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading", // "loading", "ready", "error", "active", "finished"
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const reducer = (state, { type, payload }) => {
  const { questions, status, index, points, highscore, secondsRemaining } =
    state;

  switch (type) {
    case "dataReceived":
      return { ...state, questions: payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "startQuiz":
      return {
        ...state,
        status: "active",
        secondsRemaining: questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const { correctOption, points: pts } = questions.at(index);
      return {
        ...state,
        answer: payload,
        points: payload === correctOption ? points + pts : points,
      };
    case "nextQuestion":
      return { ...state, index: index + 1, answer: null };
    case "finishQuiz":
      return {
        ...state,
        status: "finished",
        highscore: points > highscore ? points : highscore,
      };
    case "restartQuiz":
      return { ...initialState, questions, status: "ready", highscore };
    case "timerQuiz":
      return {
        ...state,
        secondsRemaining: secondsRemaining - 1,
        status: secondsRemaining === 0 ? "finished" : status,
      };
    default:
      throw new Error("Unexpected action");
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
  } = state;

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((acc, cur) => acc + cur.points, 0);

  useEffect(() => {
    fetch("http://localhost:3333/questions")
      .then(res => res.json())
      .then(data => dispatch({ type: "dataReceived", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}

        {status === "error" && <Error />}

        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}

        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              idx={index}
              answer={answer}
              points={points}
              maxPoints={maxPoints}
            />

            <Question
              question={questions.at(index)}
              answer={answer}
              dispatch={dispatch}
            />

            <Footer>
              <Timer seconds={secondsRemaining} dispatch={dispatch} />
              <NextQuestion
                answer={answer}
                idx={index}
                numQuestions={numQuestions}
                dispatch={dispatch}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
