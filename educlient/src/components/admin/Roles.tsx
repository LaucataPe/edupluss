import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getActivitiesByRole } from "../../redux/features/activitiesSlice";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Role } from "../../utils/interfaces";
import { setCurrentRole } from "../../redux/features/roleSlice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";

//PDF
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFWorkerProfile from "../rolePdf";
import axios from "axios";

function Roles() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const roles = useSelector((state: RootState) => state.roles.roles);
  const currentArea = useSelector(
    (state: RootState) => state.areas.currentArea
  );

  const [displayBasic, setDisplayBasic] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);

  const [roleId, setRoleId] = useState(0);
  const [role, setRole] = useState<Role>();

  const handleRoleClick = (role: Role) => {
    if (role && role.id) {
      dispatch(getActivitiesByRole(role.id));
      dispatch(setCurrentRole(role));
    }
  };
  const basicDialogFooter = (
    <PDFDownloadLink
      document={<PDFWorkerProfile workerProfile={role ? role : roles[0]} />}
      fileName={`${role?.name}.pdf`}
    >
      <Button
        type="button"
        label="Descargar"
        onClick={() => setDisplayBasic(false)}
        icon="pi pi-file-pdf"
        severity="danger"
      />
    </PDFDownloadLink>
  );
  const handleLook = (role: Role) => {
    setRole(role);
    setDisplayBasic(true);
  };

  const dialogHandler = (id: number) => {
    setDisplayConfirmation(true);
    setRoleId(id);
  };

  const handleDelete = async () => {
    try {
      let response = await axios.delete(`http://localhost:3001/role/${roleId}`);
      let data = response.data;
      if (data) {
        navigate(`/areas/${currentArea.id !== 0 ? currentArea.id : ''}`);
      }
      setDisplayConfirmation(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const confirmationDialogFooter = (
    <>
      <Button
        type="button"
        label="No"
        icon="pi pi-times"
        onClick={() => setDisplayConfirmation(false)}
        text
      />
      <Button
        type="button"
        label="Sí"
        icon="pi pi-check"
        onClick={handleDelete}
        text
        autoFocus
      />
    </>
  );

  const generateSubMenu = (roles: Role[], roleId: number | null): { role: Role; items: any }[] => {
    const subordinates = roles.filter((role) => role.fatherRoleId === roleId);
  
    return subordinates.map((subordinate) => {
      const subMenu = {
        role: subordinate,
        items: generateSubMenu(roles, subordinate.id ?? null) ?? [],
      };
      return subMenu;
    });
  };
  
  const generatePanelMenuModel = (roles: Role[]): { role: Role; items: any }[] => {
    const topLevelRoles = roles.filter((role) => !role.fatherRoleId);
  
    return topLevelRoles?.map((role) => ({
      role,
      items: generateSubMenu(roles, role.id ?? null),
    }));
  };

  const headerTemplate = (role: Role) => {

    return (
        <div className="flex h-12">
            <div className="flex align-items-center justify-items-center">
                <p>{role.name}</p>
            </div>
                <Button rounded text severity="info" icon="pi pi-plus" className="mr-2" 
					onClick={() => navigate(`/addRole/${currentArea.id}?fatherId=${role.id}`)}></Button>
            <div className="absolute right-2">
				<Link to={`/activities/${role.id}`}>
					<Button rounded severity="info" icon="pi pi-arrow-right" className="mr-2"
					onClick={() => handleRoleClick(role)}></Button>
				</Link>
				<Button rounded className="mr-2" icon="pi pi-eye" onClick={() => handleLook(role)}></Button>
				<Link to={`/editRole/${currentArea.id}/${role.id}`}>
					<Button rounded severity="success" className="mr-1" icon="pi pi-pencil"></Button>
				</Link>
				<Button rounded text severity="danger" icon="pi pi-times" onClick={() => dialogHandler(role.id ?? 0)}></Button>
            </div>
        </div>
    );
  };
  
  const cargos = generatePanelMenuModel(roles);

  const recursion = (items: { role: Role; items: any }[]) => {
	return items?.map((role) => {
	  return (
		<Accordion key={role.role.id}>
		  <AccordionTab header={headerTemplate(role.role)} className="my-2" key={role.role.id}>
			{role.items && recursion(role.items)}
		  </AccordionTab>
		</Accordion>
	  );
	});
  };
    
  return (
    <>
      {/*Mapea todos los roles*/}
        <div className="w-[90%] relative mx-10">
            <div className="flex justify-between items-center mb-4 mx-2">
                <h2 className="text-blue-500 m-0">{currentArea.name}</h2>
                <div className="h-[50px] flex flex-row-reverse mx-4 gap-2">                      
                    <Button className="hover:bg-blue-500 hover:text-white focus:shadow-none" label=" + Crear Director" severity="info"
                        rounded outlined onClick={() => navigate(`/addRole/${currentArea.id}`)}></Button>
                </div>
            </div>
            <div className="flex flex-wrap w-[100%]">
				{cargos.length ? cargos.map((role) => {
					return (
						<Accordion className="w-[100%]" key={role.role.id}>
							<AccordionTab header={headerTemplate(role.role)} className="my-2" key={role.role.id}>
								{role.items && recursion(role.items)}
							</AccordionTab>
						</Accordion>
					)
				}): 
				<p className="text-2xl mt-5">Aún no hay cargos en esta área</p>}              
            </div>
      </div>

      <Dialog
        header={role?.name}
        visible={displayBasic}
        style={{ width: "30vw" }}
        modal
        footer={basicDialogFooter}
        onHide={() => setDisplayBasic(false)}
      >
        <TabView>
          <TabPanel header="General">
            <p>Salario: {role?.salary}</p>
            <p>Horario: {role?.schedule}</p>
            <p>
              Experiencia:{" "}
              {role?.experience?.[1] !== 0
                ? `De ${role?.experience?.[0]} a ${role?.experience?.[1]} años`
                : "No especifíca"}
            </p>
            <p>Remoto: {role?.remote ? "Sí" : "No"}</p>
          </TabPanel>
          <TabPanel header="Técnicas">
            <ul key={role?.id}>
              {role?.hardSkills.map((skill, i) => (
                <li key={i}>- {skill}</li>
              ))}
            </ul>
          </TabPanel>
          <TabPanel header="Blandas">
            <ul key={role?.id ? role.id + 1 : 1}>
              {role?.softSkills &&
                role?.softSkills.map((skill) => <li>- {skill}</li>)}
              {role?.softSkills?.length === 0 &&
                "No se especificó ninguna habilidad blanda"}
            </ul>
          </TabPanel>
        </TabView>
      </Dialog>

      <Dialog
        header="Eliminar Cargo"
        visible={displayConfirmation}
        onHide={() => setDisplayConfirmation(false)}
        style={{ width: "350px" }}
        modal
        footer={confirmationDialogFooter}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span>
            ¿Estás seguro que desea eliminar este
            <strong> cargo, sus actividades y pasos</strong>?
          </span>
        </div>
      </Dialog>
    </>
  );
}

export default Roles;