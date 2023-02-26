import React from 'react'
import Question from './Question'
import {nanoid} from "nanoid"
import {decodeHTML} from 'entities'
import Confetti from 'react-confetti'

export default function App() {

    const [startQuiz, setStartQuiz] = React.useState(false)
    const [questions, setQuestions] = React.useState([])
    const [score, setScore] = React.useState(0)
    const [isCompleted, setIsCompleted] = React.useState(false)
    const [playAgain, setPlayAgain] = React.useState(false)
        
    React.useEffect(() => {
      fetch("https://opentdb.com/api.php?type=multiple&amount=5")
        .then(res => res.json())
        .then(data => setQuestions(data.results.map(question => (
          {
            ...question,
            answersArr: [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5), 
            selectedAnswer: "", 
            id: nanoid()
          })
        )))
    }, [playAgain])
    
    // this function triggers a new screen
    function beginQuiz() {
      setStartQuiz(true)
    }
    
    /** 
     * toggleSelection() upateds the curret selection of each
     * question, it runs every time the user clicks a different answer
     */
    function toggleSelection(questionId, choice) {

      setQuestions(oldQuestions => oldQuestions.map(question => (
        question.id === questionId ? 
          {...question, selectedAnswer: choice}:
          question
      )))
    }
    
    /**
     * scoreAnswers() runs when the 'check answer' button is clicked.
     * It maps through the questions and compares the correct_answer
     * property with the selectedAnswer property of each question and
     * adds a point accordingly. Lastly, it sets the isCompleted state 
     * to true, which is in charge of rendering the quiz result
     * and the playAgain button onto the screen
     */
    function scoreAnswers(){

      for(let i = 0; i < questions.length; i++) {
        if(questions[i].correct_answer === questions[i].selectedAnswer) {
          setScore(oldScore => oldScore + 1)
        }
      }
      setIsCompleted(true)       
    }
    
    /**
     * resetQuestions() triggers useEffect that makes an
     * API call, it resets score, and changes the quiz state 
     * to be incomplete
     */
    function resetQuestions() {
      setPlayAgain(prevState => !prevState)
      setIsCompleted(false)
      setScore(0)
    }
    
    const questionElems = questions.map(item => {
      return (
          <Question 
            key={item.id}
            question={decodeHTML(item.question)} 
            correct={decodeHTML(item.correct_answer)} 
            answersArr={item.answersArr}
            toggleSelection={toggleSelection}
            id={item.id}
            selected={item.selectedAnswer}
            isCompleted={isCompleted}
          />
        )
    })

    return (
        <>
            { !startQuiz?  
            <div className="start-screen">
                <h1 className="title">Quizzical</h1>
                <p className="description">Test how much you know. Take this short quiz!</p>
                <button className="start-btn" onClick={beginQuiz}>Start Quiz</button>
            </div>: 
            
            <div>
                {score === questions.length && <Confetti />}
                {questionElems}
                <div className="result-container">
                    {isCompleted?
                        <>
                            <h3>Your scoref {score} / {questions.length} correct answers</h3>
                            <button 
                                className="check-btn" 
                                onClick={resetQuestions}
                            >Play Again
                            </button>
                        </>: 
                        
                        <button 
                            className="check-btn"
                            onClick={scoreAnswers}
                        >Check answers
                        </button>
                    }
                </div>
            </div>
            }
        </>
    )
}
