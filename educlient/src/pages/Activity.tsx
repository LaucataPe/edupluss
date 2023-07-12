import CurrentStep from "../components/Step";
import { Step} from "../utils/interfaces";
import {useState, useEffect} from 'react'
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


function Activity() {
  const {id} = useParams()

  const [steps, setSteps] = useState<Step[]>()
  const [error, setError] = useState<string>('')
  const [stepNumber, setStepNumber] = useState<number>(0)

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
      <Link to='/'><button className="absolute top-15 py-1 px-4 inline-flex m-2 justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-blue-500 hover:text-white hover:bg-blue-500 hover:border-blue-500 transition-all text-sm dark:border-gray-700 dark:hover:border-blue-500">Atrás</button></Link>
      <h1 className="py-4 text-center text-4xl font-semibold">{findActivityName()}</h1>
      <ol className="flex items-center justify-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
      {steps?.map((step) => (
        <li className="flex items-center text-blue-600 dark:text-blue-500">
          <span onClick={() => handleNumberClick(step.number)} className="flex items-center justify-center w-10 h-10 mr-1 
          cursor-pointer text-xl border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
           {step.number}
          </span>
        </li>
      ))}
      </ol>
      {steps && <CurrentStep step={steps[stepNumber]}/>} 
      {steps && stepNumber <= steps.length ? 
      <button onClick={handleNextClick} className="border py-1 px-2 bg-green-500 text-white font-semibold
      rounded">Next {'->'}</button>:
      <Link to='/'><button>Finish</button></Link> }
      <p>{error}</p>
      </>
    );
  }
  
  export default Activity;
