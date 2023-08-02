import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setLogUser } from '../redux/features/userSlice'
import { setEmpresa } from '../redux/features/activitiesSlice'

import logo from '../assets/logo.png'

import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { uploadFile } from '../firebase/config';

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
          setError(error.response.data)
        }
      }
    }

    return (
      <>
      <div className="flex flex-column align-items-center justify-content-center">
          <div className="w-[40rem] my-20 surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
            <div className='w-[100%] flex items-center justify-center'>
            <img src={logo} alt="Logo Edupluss" className='h-[130px]' />
            </div>
            <h1>Inicia Sesión</h1>
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
                            weakLabel='Poco Segura' mediumLabel='Segura' strongLabel='Muy Segura'></Password>
                            <Button label="Ingresar" className="w-full p-3 text-xl" onClick={handleSubmit}></Button>
                        </div>
                    </div>
                    <p>{error}</p>
            </div>


          <input type="file" onChange={(e) => uploadFile(e.target.files?.[0])} />
      </>
    );
  }
  
  export default Login;