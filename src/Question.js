import React from 'react'
import {nanoid} from "nanoid"
import {decodeHTML} from 'entities'

export default function Question(props) {

    var decodedAnswersArr = [];

    for(let i = 0; i < props.answersArr.length; i++){
        decodedAnswersArr.push(decodeHTML(props.answersArr[i]))
    }
            
    const answersChoices = decodedAnswersArr.map(choice => {
            var displayCorrect = {}
            
            //displays all the correct answers
            if(props.isCompleted === true && choice === props.correct) {
                displayCorrect = {backgroundColor: "#94D7A2", border: 'none'}
            }
            
            
            return <div 
                        //runs when form is not submitted yet, to display light blue,
                        //indicating that it has been selected
                        style={props.selected === choice && !props.isCompleted?{backgroundColor: '#D6DBF5', border: 'none'}: displayCorrect}
                        key={nanoid()}
                        id={nanoid()}
                        className={
                            props.selected !== props.correct && choice === props.selected && props.isCompleted? 
                                'answer-choice incorrect': 
                                props.isCompleted && choice !== props.correct?
                                    'answer-choice lighten': 
                                    'answer-choice' 
                            }
                        onClick={(e)=>props.toggleSelection(props.id, choice)}
                    >{choice}</div>
            }
    )
  
    return (
        <div className="question--card">
            <h3 className="question">{props.question}</h3>
            <div className="answers-container">
              {answersChoices}
            </div>
        </div>
    )
}