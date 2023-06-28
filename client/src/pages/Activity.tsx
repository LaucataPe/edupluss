import CurrentStep from "../components/Step";
import { Step, steps } from "../utils/demodb";
import {useState} from 'react'
import { Link } from "react-router-dom";

function Activity() {
    const [stepNumber, setStepNumber] = useState<number>(0)
    const [step, setStep] = useState<Step>(steps[0])

    const handleNumberClick = (number: number) => {
        setStepNumber(number)
        setStep(steps[number - 1])
    }

    const handleNextClick = () => {
        setStepNumber(stepNumber + 1)
        setStep(steps[stepNumber - 1])
    }

    return (
      <>
      <Link to='/'>Back</Link>
      <h1>Title de la actividad</h1>
      {steps.map((step) => (<button key={step.number} onClick={() => handleNumberClick(step.number)}>{step.number}</button>))}
      <CurrentStep step={step}/>
      {stepNumber <= steps.length ? 
      <button onClick={handleNextClick}>Next</button>:
      <Link to='/'><button>Finish</button></Link> }
      </>
    );
  }
  
  export default Activity;