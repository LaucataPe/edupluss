import {useState} from 'react'

function Login() {
    const [step, setStep] = useState()

    return (
      <>
      <form action="">
        <label>Paso #</label>
        <input type="text" disabled={true} value={3}/>
        <label>Título:</label>
        <input type="text" placeholder='Ingrese el titulo para este paso' />
        <label>Descripción:</label>
        <textarea name="description" cols={30} rows={10} placeholder='Ingrese una breve descripción'></textarea>
        <label>Agregar video:</label>
        <input type="file" name="video"/>
      </form>
      </>
    );
  }
  
  export default Login;