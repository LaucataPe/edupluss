import CurrentStep from "../components/Step";
import { Step} from "../utils/demodb";
import {useState, useEffect} from 'react'
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


function Activity() {
  const {id} = useParams()

  const [steps, setSteps] = useState<Step[]>()
  const [error, setError] = useState<string>('')
  const [stepNumber, setStepNumber] = useState<number>(1)

  const activities = useSelector((state: RootState) => state.activities.activities)

    useEffect(() => {
      const fetchEmpresas = async () =>{
        try {
          const response = await axios(`http://localhost:3001/steps/${id}`)
          console.log(response);
          
          setSteps(response.data);
          
        } catch (error: any) {
          setError(error.message)
        }
      }
      fetchEmpresas() 
    }, [])

    const findActivityName = () =>{
      const ActivityName = activities.find((act) => act.id === Number(id))
      return ActivityName?.title
    }


    const handleNumberClick = (number: number) => {
        setStepNumber(number)
        //setStep(steps[number - 1])
    }

    const handleNextClick = () => {
        setStepNumber(stepNumber + 1)
        //setStep(steps[stepNumber - 1])
    }

    return (
      <>
      <Link to='/'>Back</Link>
      <h1>{findActivityName()}</h1>
      {steps?.map((step) => (<button key={step.number} onClick={() => handleNumberClick(step.number)}>{step.number}</button>))}
      {steps && <CurrentStep step={steps[stepNumber - 1]}/>} 
      {steps && stepNumber <= steps.length ? 
      <button onClick={handleNextClick}>Next</button>:
      <Link to='/'><button>Finish</button></Link> }
      <p>{error}</p>
      </>
    );
  }
  
  export default Activity;