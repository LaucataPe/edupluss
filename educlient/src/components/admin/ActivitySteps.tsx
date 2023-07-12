import { useSelector} from "react-redux";
import {useEffect} from 'react'
import { RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getStepsActivity } from "../../redux/features/stepsSlider";


function ActivitySteps() {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const steps = useSelector((state: RootState) => state.steps.steps)
    const activities = useSelector((state: RootState) => state.activities.originalCopy)

    useEffect(() => {
      dispatch(getStepsActivity(Number(id)));
    }, []);
    
    const name = activities.find((activity) => activity.id === Number(id))?.title
    
    return (
      <>
      <div>
        <h1>{name}</h1>
        {steps && steps.map((step) => (
          <div key={step.id}>
            <span>{step.number}</span>
            <h2>{step.title}</h2>
          </div>
        ))}
        <Link to={`/addStep/${id}`}><button>+</button></Link>
      </div>
      <Link to={`/admin`}><button>Atrás</button></Link>
      </>
    );
  }
  
  export default ActivitySteps;