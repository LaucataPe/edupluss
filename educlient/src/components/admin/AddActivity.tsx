import {useState} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Activity } from '../../utils/interfaces'
import { RootState } from '../../redux/store'

function AddActivity() {
    
  const currentRole = useSelector((state: RootState) => state.roles.currentRole)

    const [activity, setActivity] = useState<Activity>({
      title: '',
      roleId: currentRole.id ?? 0
    })
    const [error, setError] = useState()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if(activity.roleId !== 0){
        try {
          const response = await axios.post('http://localhost:3001/activity', activity)
          if(response){
            alert('La actividad fue creada con éxito')
          }
          setActivity({
            title: '',
            roleId: 0
          })
        } catch (error: any) {
          setError(error)
        }
      }else{
        return alert('No se encontró el cargo relacionado a esta actividad')
      }
    }

    return (
      <>
      <h1 className='text-center p-5 text-3xl text-blue-500 font-semibold'>Creando Actividad</h1>
      <form onSubmit={(e) => handleSubmit(e)} className='mx-[20%]'>
        <div className="relative z-0 w-full mb-6 group">
            <input type="text" name="title" 
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent 
              border-0 border-b-2 border-gray-300 appearance-none dark:text-white
              dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none 
              focus:ring-0 focus:border-blue-600 peer" placeholder='  ' required
              value={activity.title}
              onChange={(e) => setActivity({...activity, title: e.target.value})}
              />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500
            dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 
            origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75
              peer-focus:-translate-y-6">Nombre</label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
          <input type="text" 
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent 
            border-0 border-b-2 border-gray-300 appearance-none dark:text-white
            dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none 
            focus:ring-0 focus:border-blue-600 peer" placeholder='  ' disabled
            value={currentRole?.name}
            />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500
           dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 
           origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
           peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75
            peer-focus:-translate-y-6">Cargo</label>
        </div>
        <button type='submit'
        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
          dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >Crear Actividad</button>
      </form>
      <Link to={`/admin`}><button className='py-1 px-2 bg-green-400 text-white font-semibold'>Atrás</button></Link>
      <p className='text-red-500 font-semibold'>{error}</p>
      </>
    );
  }
  
  export default AddActivity;