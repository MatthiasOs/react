import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import './app.css'

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [time, setTime] = React.useState(Date.now())
    //const [results, setResults] = React.useState(() => JSON.parse(localStorage.getItem("results")) || [])
    const [results, setResults] = React.useState([])

    React.useEffect(() => {
        if(tenzies){
            console.log("All Old Results:", results)
            setResults(prev => {
                console.log(prev)
                const newArray = [...prev, {time:1, rolls:1}]
                console.log(newArray)
                return newArray
            })
            console.log("All New Results:", results)
            localStorage.setItem("results", results)
        }
    },[tenzies])
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRolls(prev => prev + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setTime(Date.now())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    function getAmountOfSeconds(){
        const now = Date.now()
        return ((now -  time) / 1000).toFixed()
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            {tenzies &&
                <div className="result">
                    It took you {getAmountOfSeconds()} seconds and you needed {rolls} rolls!
                </div>
            }
        </main>
    )
}