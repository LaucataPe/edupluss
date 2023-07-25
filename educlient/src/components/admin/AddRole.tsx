import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Role } from '../../utils/interfaces'
import { RootState } from '../../redux/store'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch'; 
//import { getTimeFromString } from '../../utils/services'

function AddRole() {

    const currentArea = useSelector((state: RootState) => state.areas.currentArea)
    //Experiencia
    const [first, setFirst] = useState<number>(0)
    const [last, setLast] = useState<number>(0)
    const [activeExp, setActiveExp] = useState<boolean>(false)

    //Horario
    const [startTime, setStartTime] = useState('')
    const [finishTime, setFinishTime] = useState('')
    const [activeTime, setActiveTime] = useState<boolean>(false)

    const [role, setRole] = useState<Role>({
        name: '',
        hardSkills: [],
        softSkills: [],
        schedule: '',
        salary: '',
        experience: [],
        remote: false,
        areaId: currentArea.id
    })

    useEffect(() => {
      setRole(prevRole => ({
        ...prevRole,
        schedule: `De ${startTime} a ${finishTime}`
      }));
    }, [startTime, finishTime]);

    useEffect(() => {
      setRole(prevRole => ({
        ...prevRole,
        experience: [first, last]
      }));
    }, [first, last]);

    //Habilidades
    const [hardSkill, setHardSkill] = useState('')
    const [softSkill, setSoftSkill] = useState('')

    const onSwitchChange = (e: any) => {
      const { value } = e.target;
      setRole({
        ...role,
        remote: value
      });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof Role) => {
      const { value } = e.target;
      setRole({...role,
        [name]: value
      });
    };

    

    //Habilidades

    const addHardSkill = (nuevaHabilidad: string) => {
      setRole({ ...role, hardSkills: [...role.hardSkills, nuevaHabilidad] });
    };
  
    const addSoftSkill = (nuevaHabilidad: string) => {
      if(role.softSkills){
        setRole({ ...role, softSkills: [...role.softSkills, nuevaHabilidad] });
      }
    };

    const deleteHardSkill = (index: number) => {
      const nuevasHabilidadesTecnicas = [...role.hardSkills];
      nuevasHabilidadesTecnicas.splice(index, 1);
      setRole({ ...role, hardSkills: nuevasHabilidadesTecnicas });
    };
  
    const deleteSoftSkill = (index: number) => {
      if(role.softSkills){
        const newSoftSkills = [...role.softSkills];
        newSoftSkills.splice(index, 1);
        setRole({ ...role, softSkills: newSoftSkills });
      }
    };

   
    const handleSubmit = async () => {
      try {
        const response = await axios.post('http://localhost:3001/role', role)
        if(response){
          //toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Paso creado', life: 3000 });
          //navigate(`/admin`)
          alert('You did it!')
          setRole({
            name: '',
            hardSkills: [],
            softSkills: [],
            schedule: '',
            salary: '',
            experience: [],
            remote: false,
            areaId: currentArea.id
        })
        } 
        
      } catch (error: any) {
        console.log(error);
      }
    }

    return (
      <>
          <div className="card p-fluid mx-[25%]">
              <h5>Creación de cargo</h5>
              <div className="formgrid grid mb-3">
                  <div className="field col">
                      <label>Nombre del Cargo</label>
                      <InputText id="name2" type="text" onChange={(e) => onInputChange(e, 'name')}/>
                  </div>
                  <div className="field col">
                      <label>Salario</label>
                      <div className='p-inputgroup'>
                        <span className="p-inputgroup-addon">$</span>
                        <InputText id="email2" type="text" onChange={(e) => onInputChange(e, 'salary')}/>
                      </div>                  
                  </div>
                  <div className="field col-2">
                      <label htmlFor="email2">Remoto</label><br />
                      <InputSwitch checked={role.remote ? role.remote : false }  onChange={(e) => onSwitchChange(e)} />
                  </div>
              </div>
              <div className="formgrid grid mb-3">
                  <div className="field col">
                      <label>Horario</label> 
                      <input type="checkbox" checked={activeExp} onChange={() => setActiveExp(!activeExp)} className='mx-2'/>
                      <div className='flex items-center pr-4'>
                        <p className='m-0 mr-2'>De</p>
                        <InputText type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} 
                        disabled={activeExp ? false : true}/>
                        <p className='m-0 mx-2'>a</p>
                        <InputText type="time" value={finishTime} onChange={(e) => setFinishTime(e.target.value)}
                         disabled={activeExp ? false : true}/>
                      </div> 
                  </div>
                  <div className="field col">
                      <label htmlFor="name2">Experiencia</label>
                      <input type="checkbox" checked={activeTime} onChange={() => setActiveTime(!activeTime)} className='mx-2'/>
                      <div className='flex items-center pr-3'>
                      <p className='mr-2 m-0'>De</p>
                        <InputText type="number" value={first.toString()} onChange={(e) => setFirst(Number(e.target.value))}
                        disabled={activeTime ? false : true}/>
                        <p className='m-0 mx-2'>a</p>
                        <InputText type="number" value={last.toString()} onChange={(e) => setLast(Number(e.target.value))}
                        disabled={activeTime ? false : true}/>
                        <p className='ml-2'>años</p>
                      </div>                 
                  </div>
              </div>
              <div className="formgrid grid">
                <div className="field col">
                  <label>Habilidades técnicas</label>
                  <div className='p-inputgroup'>
                    <InputText placeholder="Escribe un requerimiento técnico" value={hardSkill}
                    onChange={(e) => setHardSkill(e.target.value)}/>
                    <Button label="+ Agregar" 
                    onClick={() => {
                      addHardSkill(hardSkill);
                      setHardSkill('');
                    }}/>
                  </div>
                </div>
                <div className="field col">
                  <label>Habilidades Blandas</label>
                  <div className='p-inputgroup'>
                    <InputText placeholder="Escribe una habilidad blanda" value={softSkill}
                    onChange={(e) => setSoftSkill(e.target.value)}/>
                    <Button label="+ Agregar" 
                    onClick={() => {
                      addSoftSkill(softSkill);
                      setSoftSkill('');
                    }}/>
                  </div>
                </div>
              </div>
              <div className="formgrid grid">
                  <div className="field col">
                    <ol>
                      {role.hardSkills.map((habilidad, index) => (
                        <li key={index} className='flex items-center my-2'>
                          {habilidad}
                          <Button icon="pi pi-times" rounded severity="danger" text 
                            onClick={() => deleteHardSkill(index)}/>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="field col">
                    <ul>
                        {role.softSkills?.map((habilidad, index) => (
                          <li key={index} className='flex items-center my-2'>
                            {habilidad}
                            <Button icon="pi pi-times" rounded severity="danger" text 
                            onClick={() => deleteSoftSkill(index)}/>
                          </li>
                        ))}
                      </ul>           
                  </div>
              </div>
              <Button label='Crear Cargo' onClick={handleSubmit}/>
          </div>
      </>
    );
  }
  
  export default AddRole;