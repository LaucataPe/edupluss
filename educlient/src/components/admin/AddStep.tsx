import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { CreateStep } from '../../utils/interfaces';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from '../../hooks/typedSelectors';
import { getStepsActivity } from '../../redux/features/stepsSlider';
import { RootState } from '../../redux/store';

function AddStep() {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const steps = useSelector((state: RootState) => state.steps.steps)

    const [stepNumber, setStepNumber] = useState(1)
    const [step, setStep] = useState<CreateStep>({
      number: stepNumber,
      title: '',
      description: '',
      video: '',
      activityId: Number(id)
    })
    //const [errors, setErrors] = useState('')

    useEffect(() => {
      if(steps.length === 0){
        dispatch(getStepsActivity(Number(id)));
      }
      const NextStep = () => {
        const stepsOrder = [...steps].sort((a, b) => a.number - b.number)
        if(stepsOrder.length > 0){
          const nextNumber = stepsOrder[0].number + 1
          setStepNumber(nextNumber)
        }
      }
      NextStep()
    }, []);

    

    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setStep({...step, 
          [event.target.name]: event.target.value})
      
      /*setErrors(validate({
          ...input,
          [event.target.name]: event.target.value,
      }))*/
    }

    const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) =>{
      setStep({...step, 
          [event.target.name]: event.target.value})
      
      /*setErrors(validate({
          ...input,
          [event.target.name]: event.target.value,
      }))*/
    }

    const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) =>{
      if(e.target.files !== null){
        const file = e.target.files[0];
        if(file){
          setFileToBase(file);
          console.log(file);
        }
      }
    }

    const setFileToBase = (file: Blob) =>{
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () =>{
          setStep({...step, 
              video: reader.result});
      }
    }

    const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
      e.preventDefault();
          try {
              let response = await axios.post(`http://localhost:3001/step`, step);
              let data = response.data;
              if(data){
                  return alert('El paso fue creado correctamente')
              } 
           } catch (error) {
           console.log(error);       
           }
          setStep({
            number: stepNumber,
            title: '',
            description: '',
            video: '',
            activityId: Number(id)
          })
     
    }

    return (
      <>
      <form action="">
        <label>Paso #</label>
        <input type="text" name='number' disabled={true} value={stepNumber} />
        <label>Título:</label>
        <input type="text" name='title' placeholder='Ingrese el titulo para este paso' value={step.title} 
        onChange={(e) => handleInputs(e)}/>
        <label>Descripción:</label>
        <textarea name="description" cols={30} rows={10} placeholder='Ingrese una breve descripción'
        value={step.description} 
        onChange={(e) => handleDescription(e)}></textarea>
        <label>Agregar video:</label>
        <input type="file" name="video" onChange={(e) => handleVideo(e)} disabled={step.video ? true : false}/>or
        <input type="text" name="video" onChange={(e) => handleInputs(e)}
        disabled={step.video ? true : false} placeholder='Ingrese la url de un video'/>
        <button type='submit' onClick={(e) => handleSubmit(e)}>Crear Paso</button>
      </form>

      <Link to={`/actvitySteps/${id}`}><button>Atrás</button></Link>
      </>
    );
  }
  
  export default AddStep;