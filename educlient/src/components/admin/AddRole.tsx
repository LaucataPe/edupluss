import {useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Role } from '../../utils/interfaces'
import { RootState } from '../../redux/store'
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch'; 
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/typedSelectors'
import { getRolesByArea, setCurrentRole } from '../../redux/features/roleSlice'
import { fetchCompanyAreas, setCurrentArea } from '../../redux/features/areaSlice'
//import { getTimeFromString } from '../../utils/services'

function AddRole() {
    const {areaId, roleId} = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const roles = useSelector((state: RootState) => state.roles.roles)
    const areas = useSelector((state: RootState) => state.areas.areas)
    const currentEmpresa = useSelector((state: RootState) => state.activities.selectEmpresa)
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
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if(areas.length === 0){
          dispatch(fetchCompanyAreas(currentEmpresa.id))
        }
        const findArea = areas.find((area) => area.id === Number(areaId))
        if(findArea?.id){  
          dispatch(setCurrentArea(findArea))
        }
    }, [currentArea, areas]);

    useEffect(() => {
      if(roleId){
        if(roles.length === 0){
          dispatch(getRolesByArea(currentArea.id ?? 0))
        }
        const findRole = roles.find((role) => role.id === Number(roleId))
        if(findRole){  
          dispatch(setCurrentRole(findRole))
          setRole(findRole)
          if(findRole.experience){
            setFirst(Number(findRole.experience[0]))
            setLast(Number(findRole.experience[1]))
          }
        }
      }
    }, [roleId, roles]);

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
        const response = await axios.post('https://edupluss.onrender.com/role', role)
        if(response){
          toast.current?.show({ severity: 'success', summary: 'Eliminado!', detail: 'Cargo creado', life: 2000 });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          navigate('/admin')
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

    const handleEdit = async () => {
      try {
        const response = await axios.put('https://edupluss.onrender.com/role/update', role)
        if(response){
          toast.current?.show({ severity: 'success', summary: 'Editado!', detail: 'Cargo editado', life: 2000 });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          dispatch(getRolesByArea(currentArea.id ?? 0))
          navigate('/admin')
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
          <div className="card p-fluid mx-[10%] my-2">
          <Toast ref={toast} />
              {roleId ? <h5>Editando Cargo</h5> : <h5>Creando Cargo</h5>}
              <div className="formgrid grid">
                  <div className="field col">
                      <label>Nombre del Cargo</label>
                      <InputText id="name2" type="text" value={role.name} onChange={(e) => onInputChange(e, 'name')}/>
                  </div>
                  <div className="field col">
                      <label>Salario</label>
                      <div className='p-inputgroup'>
                        <span className="p-inputgroup-addon">$</span>
                        <InputText id="email2" type="text" value={role.salary} onChange={(e) => onInputChange(e, 'salary')}/>
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
              <Button label={roleId ? 'Editar' : 'Crear cargo'} onClick={roleId ? handleEdit : handleSubmit}/>
          </div>
      </>
    );
  }
  
  export default AddRole;