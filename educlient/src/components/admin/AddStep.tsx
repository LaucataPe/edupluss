import {useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux';
import { CreateStep } from '../../utils/interfaces';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from '../../hooks/typedSelectors';
import { getStepsActivity } from '../../redux/features/stepsSlider';
import { RootState } from '../../redux/store';

import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch'; 
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

import { StepErrors, validate } from '../../utils/validateSteps';

function AddStep() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {id} = useParams()
    const steps = useSelector((state: RootState) => state.steps.steps)
    
    const toast = useRef<Toast>(null);

    const [stepNumber, setStepNumber] = useState(1)
    const [step, setStep] = useState<CreateStep>({
      number: stepNumber,
      title: '',
      description: '',
      video: '',
      activityId: Number(id)
    })
    const [errors, setErrors] = useState<StepErrors>({title: ''});

    //Videos
    const [videoOrigin, setVideoOrigin] = useState<boolean>(false);
    const [videoURL, setVideoURL] = useState<string>('');
    const [videoFile, setVideoFile] = useState<string | ArrayBuffer | null>(null);

    useEffect(() => {
      if(steps.length === 0){
        dispatch(getStepsActivity(Number(id)));
      }
      const NextStep = () => {
        const stepsOrder = [...steps].sort((a, b) => b.number - a.number)        
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
      
      setErrors(validate({
          ...step,
          title: event.target.value,
      }))
    }

    const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) =>{
      setStep({...step, 
          [event.target.name]: event.target.value})
      
      setErrors(validate({
          ...step,
          [event.target.name]: event.target.value,
      }))
    }

    const handleVideoOrigin = (checked: boolean) => {
      setVideoOrigin(checked);
      setStep({...step, video: ''})
      setErrors(validate({...step, video: ''}))
      // Resetear los valores al cambiar el origen del video
      setVideoURL('');
      setVideoFile(null);
    };

    const handleVideoURL = (event: React.ChangeEvent<HTMLInputElement>) => {
      setVideoURL(event.target.value);
      setVideoFile(null);
      setStep({...step, 
        [event.target.name]: event.target.value})
      setErrors(validate({
        ...step,
        video: event.target.value
      }))
    };
    

    const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) =>{
      if(e.target.files !== null){
        const file = e.target.files[0];
        if(file){
          setFileToBase(file);
          setVideoURL('');
        }
      }
    }

    const setFileToBase = (file: Blob) =>{
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () =>{

          setVideoFile(reader.result);
          setStep({...step, video: reader.result})
          setErrors(validate({
                ...step,
                video: reader.result,
          }))
      }
    }

    const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
      e.preventDefault();
          try {
              let response = await axios.post(`http://localhost:3001/step`, step);
              let data = response.data;
              if(data){
                toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Paso creado', life: 3000 });
                navigate(`/actvitySteps/${id}`)
                setStep({
                  number: stepNumber,
                  title: '',
                  description: '',
                  video: '',
                  activityId: Number(id)
                })
              } 
           } catch (error: any) {
            console.log(error);
            
            setErrors({...errors, send: `Se presentó el siguiente error al enviar ${error.message}`})  
           }     
    }

    return (
      <>
      <Link to={`/actvitySteps/${id}`}><Button icon="pi pi-angle-double-left" label='Atrás' rounded 
        severity="secondary" className='m-2' /></Link>
      <form action="">
      <div className="card p-fluid mx-5">
        <h5>Paso #{stepNumber}</h5>
          <div className="field">
            <label>Título:</label>
            <InputText name="title" type="text" placeholder='Ingrese el título para este paso' value={step.title} 
              onChange={(e) => handleInputs(e)} className={errors.title ? 'p-invalid' : ''}/>
            <p className='font-semibold text-red-600'>{errors.title ? errors.title : ''}</p>
          </div>
                    <div className="field"> 
                        <label>Descripción:</label>
                        <InputTextarea 
                          name="description" 
                          rows={2} 
                          placeholder='Ingrese una breve descripción'
                          value={step.description} 
                          onChange={(e) => handleDescription(e)}
                          className={errors.description ? 'p-invalid' : ''}
                          />
                        <p className='font-semibold text-red-600'>{errors.description ? errors.description : ''}</p>
                    </div>
                    <div className="field">
                      <h5>Agregar Video</h5>
                      <div className='flex items-center my-2'>
                        Archivo
                        <InputSwitch checked={videoOrigin} onChange={(e) => handleVideoOrigin(e.value ?? false)} className='mx-2'/>
                        Url
                      </div>
                      
                      {videoOrigin ? (
                        <InputText
                          name="video"
                          type="text"
                          placeholder="Ingrese una url"
                          value={videoURL}
                          onChange={(e) => handleVideoURL(e)}
                          className={errors.video ? 'p-invalid' : ''}
                        />
                      ) : (
                        <input type="file" name="video" onChange={(e) => handleVideo(e)} accept="video/*" size={16000000} />
                      )}
                      <p className='font-semibold text-red-600'>{errors.video ? errors.video : ''}</p>
                    </div> 
        <Button label="Crear Paso" severity="info" outlined type='submit' onClick={(e) => handleSubmit(e)}
          disabled={Object.keys(errors).length > 0 ? true : false}/>              
      </div>   
      </form>

      <p className='font-semibold text-red-600'>{errors.send ? errors.send : ''}</p>    
      </>
    );
  }
  
  export default AddStep;