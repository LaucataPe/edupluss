import { useSelector} from "react-redux";
import {useEffect} from 'react'
import { RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getStepsActivity } from "../../redux/features/stepsSlider";
import { Button } from "primereact/button";


function ActivitySteps() {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const steps = useSelector((state: RootState) => state.steps.steps)
    const activities = useSelector((state: RootState) => state.activities.activities)

    useEffect(() => {
      dispatch(getStepsActivity(Number(id)));
    }, []);
    
    const name = activities.find((activity) => activity.id === Number(id))
    console.log(name);
    
    return (
      <>
      <div>
        <h1>{name ? name.title : 'No se encontró la actividad'}</h1>
        {steps && steps.map((step) => (
          <div key={step.id}>
            <span>{step.number}</span>
            <h2>{step.title}</h2>
          </div>
        ))}
        <Link to={`/addStep/${id}`}><Button label="+ Añadir Paso" severity="info" rounded /></Link>
      </div>
      <Link to={`/admin`}><Button icon="pi pi-angle-double-left" rounded severity="secondary" /></Link>
      </>
    );
  }
  
  export default ActivitySteps;