import {useState} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Area } from '../../utils/interfaces'
import { RootState } from '../../redux/store'

function AddArea() {
    const currentEmpresa = useSelector((state: RootState) => state.activities.selectEmpresa)

    const [area, setArea] = useState<Area>({
      name: '',
      companyId: currentEmpresa.id     
    })
    const [error, setError] = useState({})



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const response = await axios.post('http://localhost:3001/area', area)
        if(response){
          alert('El área fue creada con éxito')
        }
        setArea({
          name: '',
          companyId: currentEmpresa.id 
        })
      } catch (error: any) {
        setError({error})
      }
    }

    return (
      <>
      <h1 className='text-center p-5 text-3xl text-blue-500 font-semibold'>Creando Área</h1>
      <form onSubmit={(e) => handleSubmit(e)} className='mx-[20%]'>
        <div className="relative z-0 w-full mb-6 group">
          <input type="text" name="name" 
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent 
            border-0 border-b-2 border-gray-300 appearance-none dark:text-white
            dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none 
            focus:ring-0 focus:border-blue-600 peer" placeholder='  ' required
            value={area.name}
            onChange={(e) => setArea({...area, name: e.target.value})}
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
            focus:ring-0 focus:border-blue-600 peer" placeholder='  ' required disabled
            value={currentEmpresa.name}
            />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500
           dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 
           origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
           peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75
            peer-focus:-translate-y-6">Empresa</label>
        </div>
        <button type='submit' disabled={Object.keys(error).length === 0 ? false : true}
        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
          dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >Crear Área</button>
      </form>
      </>
    );
  }
  
  export default AddArea;