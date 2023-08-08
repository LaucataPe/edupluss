import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setLogUser } from '../redux/features/userSlice'
import { setEmpresa } from '../redux/features/activitiesSlice'

//import logo from '../assets/logo.png'
import edupluss from '../assets/edupluss.png'

import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
      email: '',
      password: ''
    })
    const [error, setError] = useState()
    const toast = useRef<Toast>(null);

    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setInputs({...inputs, 
        [event.target.name]: event.target.value})
    }
    const handleSubmit = async () => {
      if(inputs.email && inputs.password){
        try {
          const {data} = await axios.post('https://edupluss.onrender.com/logUser', inputs)
          if(data){
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado', life: 3000 });
            const token = data.token;
			      window.localStorage.setItem("token", token);
            
            dispatch(setLogUser(data.user))
            dispatch(setEmpresa(data.company))
          }
          if(data.user.tipo === 'admin'){
            navigate('/crud')
          } else{
            navigate('/home')
          }
        } catch (error: any) {  
          console.log(error.response.data);
               
          setError(error.response.data)
        }
      }
    }

    return (
      <>
      <div className="flex flex-column align-items-center justify-content-center">
          <div className="w-[40rem] my-20 surface-card py-3 px-2 sm:px-8" style={{ borderRadius: '53px' }}>
            <div className='w-[100%] flex items-center justify-center'>
            <img src={edupluss} alt="Logo Edupluss" className='h-[200px]' />
            </div>
            <h3>Inicia Sesión</h3>
            <div>
              <label className="block text-900 text-xl font-medium mb-2">
                Correo
              </label>
              <InputText type="text" name='email' placeholder="Ingresar correo" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} 
                value={inputs.email} onChange={(e) => handleInputs(e)}/>
                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <Password name='password' value={inputs.password} onChange={(e) => handleInputs(e)} 
                            toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" placeholder="Ingresar contraseña"
                            feedback={false}></Password>
                            <p className='p-error font-bold'>{error}</p>
                            <Button label="Ingresar" className="w-full p-3 text-xl" onClick={handleSubmit}
                            disabled={inputs.email === '' || inputs.password === '' ? true : false}></Button>
                        </div>
                    </div>
            </div>
      </>
    );
  }
  
  export default Login;