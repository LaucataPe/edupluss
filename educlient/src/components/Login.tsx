import {useState} from 'react'
import { FaRegEye, FaRegEyeSlash} from 'react-icons/fa'

function Login() {
    const [inputs, setInputs] = useState({
      email: '',
      password: ''
    })
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setInputs({...inputs, 
        [event.target.name]: event.target.value})
    }

    const handleShowPassword = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
      e.preventDefault()
      setShowPassword(!showPassword)
    }

    return (
      <>
      <form action="">
        <label>Correo:</label>
        <input type="text" name='email' value={inputs.email} onChange={(e) => handleInputs(e)}/>
        <label>Contraseña:</label>
        <input type={showPassword === true ? "text" : "password"} name='password' 
        value={inputs.password} onChange={(e) => handleInputs(e)}/>
        <button onClick={(e) => handleShowPassword(e)}>
          {showPassword === true? <FaRegEye/> : <FaRegEyeSlash/>}</button>
        <button>Ingresar</button>
      </form>
      </>
    );
  }
  
  export default Login;