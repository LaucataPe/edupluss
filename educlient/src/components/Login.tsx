import {useState} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setLogUser } from '../redux/features/userSlice'
import { setEmpresa } from '../redux/features/activitiesSlice'

import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
//import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
      email: '',
      password: ''
    })
    const [error, setError] = useState()

    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setInputs({...inputs, 
        [event.target.name]: event.target.value})
    }
    const handleSubmit = async () => {
      if(inputs.email && inputs.password){
        try {
          const {data} = await axios.post('http://localhost:3001/logUser', inputs)
          console.log(data);          
          if(data){
            const token = data.token;
			      window.localStorage.setItem("token", token);
            
            dispatch(setLogUser(data.user))
            dispatch(setEmpresa(data.company))
          }
          alert('Inicio de sesión exitoso')
          if(data.user.tipo === 'admin'){
            navigate('/crud')
          } else{
            navigate('/home')
          }
        } catch (error: any) {
          console.log(error);
          
          setError(error.response.data)
        }
      }
    }

    return (
      <>
      <div className="flex flex-column align-items-center justify-content-center">
          <div className="w-[40rem] my-20 surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
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
                            toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"  placeholder="Ingresar contraseña"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                 <div className="flex align-items-center">
                                    {/* <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox> */}
                                    <label htmlFor="rememberme1">Recordarme</label>
                                </div> 
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Olvidaste tu contraseña?
                                </a>
                            </div>
                            <Button label="Ingresar" className="w-full p-3 text-xl" onClick={handleSubmit}></Button>
                        </div>
                    </div>
                    <p>{error}</p>
            </div>
      </>
    );
  }
  
  export default Login;