import { useState} from "react";
import { useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getActivitiesByRole } from "../../redux/features/activitiesSlice";
import { FaUser } from "react-icons/fa";
import { Role } from "../../utils/interfaces";
import { setCurrentRole } from "../../redux/features/roleSlice";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';

//PDF
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFWorkerProfile from "../rolePdf";

function Roles() {
    const dispatch = useAppDispatch()
    const roles = useSelector((state: RootState) => state.roles.roles)
    const currentArea = useSelector((state: RootState) => state.areas.currentArea)

    const [displayBasic, setDisplayBasic] = useState(false);
    const [role, setRole] = useState<Role>();

    const handleRoleClick = (role: Role) =>{
      if(role && role.id){
        dispatch(getActivitiesByRole(role.id))
        dispatch(setCurrentRole(role))
      }
    }
    const basicDialogFooter = (
      <PDFDownloadLink document={<PDFWorkerProfile workerProfile={role ? role : roles[0]}/>} fileName={`${role?.name}.pdf`}>
        <Button type="button" label="Descargar" onClick={() => setDisplayBasic(false)} icon="pi pi-file-pdf" severity="danger" />
      </PDFDownloadLink>
    ) 

    const handleLook = (role: Role) => {
      setRole(role)
      setDisplayBasic(true)
    }

    return (
      <>
      {/*Mapea todos los roles*/}
      <div className="w-[90%] relative mx-10">
        <div className="flex items-center justify-center">
          <h3 className="m-2 text-indigo-500">{currentArea.name}</h3>
          <Link to={`/editArea/${currentArea.id}`}><Button icon="pi pi-pencil" rounded severity="success" text /></Link>
        </div>
        
          {roles.map((role) => (
            <div key={role.id} onClick={() => handleRoleClick(role)}
             className="border-1 surface-border border-round m-1 text-center py-5 w-3">
              <div className="mb-3 flex justify-center">
                <FaUser className="text-8xl text-center"/>
              </div>
              <div>
                <h4 className="p-mb-1">{role.name}</h4>
                <div className="car-buttons mt-5">
                  <Button rounded className="mr-2" icon="pi pi-eye" onClick={() => handleLook(role)}></Button>
                  <Link to={`/editRole/${currentArea.id}/${role.id}`}><Button rounded severity="success" className="mr-2" icon="pi pi-pencil"></Button></Link> 
                  <Link to={`/activities/${role.id}`}><Button rounded severity="info" icon="pi pi-arrow-right"></Button></Link>
                </div>
              </div>  
            </div>
          ))}
          {roles.length === 0 ? <p className="text-2xl text-blue-500 m-10"
          >Aún no hay cargos en esta área </p>: ''}
      </div>
      
      <Dialog header={role?.name} visible={displayBasic} style={{ width: '30vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
        <TabView>
          <TabPanel header="General">
            <p>Salario: {role?.salary}</p>
            <p>Horario: {role?.schedule}</p>
            {/* <p>Experiencia: De {role?.experience[0]} a {role?.experience[1]}</p> */}
            <p>Remoto: {role?.remote ? 'Sí' : 'No'}</p>
          </TabPanel>
          <TabPanel header="Requerimientos">
            <ul>
              {role?.hardSkills.map((skill) => (
                <li>- {skill}</li>
              ))}
            </ul>
          </TabPanel>
          <TabPanel header="Extra">
            <ul>
              {role?.softSkills && role?.softSkills.map((skill) => (
                <li>- {skill}</li>
              ))}
              {!role?.softSkills && 'No se especificó ninguna habilidad blanda'}
            </ul>
          </TabPanel>                       
        </TabView>
      </Dialog>

      <Link to={`/addRole/${currentArea.id}`}><button className="py-2 px-4 flex absolute bottom-10 right-10
      justify-center items-center rounded-full 
      font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-xl
       dark:focus:ring-offset-gray-800">+ Añadir Cargo</button></Link>
      
      </>
    );
  }
  
  export default Roles;