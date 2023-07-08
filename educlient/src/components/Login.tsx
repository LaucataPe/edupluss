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
      <h1 className='text-3xl font-semibold text-center p-10'>Inicia Sesión</h1>
      <div className='mx-auto px-20'>
        <form action="" className='flex flex-col md:px-8'>
          <div className='flex flex-col pt-4'>
            <label className='text-lg'>Correo:</label>
            <input type="text" name='email' value={inputs.email} onChange={(e) => handleInputs(e)}
              className='shadow appearance-none border rounded w-full py-2 px-3
            text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline'/>
          </div>
          <div className='flex flex-col pt-4'>
            <label className="text-lg">Contraseña:</label>
            <input type={showPassword === true ? "text" : "password"} name='password' 
            value={inputs.password} onChange={(e) => handleInputs(e)}
              className='shadow appearance-none border rounded w-full py-2 px-3
              text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline' 
              />
            <button onClick={(e) => handleShowPassword(e)}>
              {showPassword === true? <FaRegEye className='inset-y-0 right-0 z-40'/> 
              : <FaRegEyeSlash className='text-2xl text-blue-500'/>}</button>
          </div>
          
          <button className='py-3 px-4 my-5 inline-flex justify-center items-center gap-2 rounded-md bg-blue-100 border border-transparent font-semibold text-blue-500 hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm'
          >Ingresar</button>
        </form>
      </div>
      </>
    );
  }
  
  export default Login;