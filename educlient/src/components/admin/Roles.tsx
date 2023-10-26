import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getActivitiesByRole } from "../../redux/features/activitiesSlice";
import { FaUser } from "react-icons/fa";
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
        navigate("/admin");
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

  return (
    <>
      {/*Mapea todos los roles*/}
        <div className="w-[90%] relative mx-10">
            <div className="flex justify-between items-center mb-4 mx-2">
                <h2 className="text-blue-500 m-0">{currentArea.name}</h2>
                <div className="h-[50px] flex flex-row-reverse mx-4 gap-2">                      
                    <Button className="hover:bg-blue-500 hover:text-white focus:shadow-none" label=" + Crear Cargo" severity="info"
                        rounded outlined onClick={() => navigate(`/addRole/${currentArea.id}`)}></Button>
                </div>
            </div>
            <div className="flex flex-wrap">
                {roles.map((role) => (
                    <div
                    key={role.id}
                    onClick={() => handleRoleClick(role)}
                    className="relative border-1 surface-border border-round mx-1 my-2 text-center py-5 w-[300px]"
                    >
                    <Button
                        rounded
                        text
                        severity="danger"
                        className="absolute top-0 right-0"
                        icon="pi pi-times"
                        onClick={() => dialogHandler(role.id ?? 0)}
                    ></Button>
                    <div className="mb-3 flex justify-center">
                        <FaUser className="text-8xl text-center" />
                    </div>
                    <div>
                        <h4 className="p-mb-1">{role.name}</h4>
                        <div className="car-buttons mt-5">
                        <Button
                            rounded
                            className="mr-2"
                            icon="pi pi-eye"
                            onClick={() => handleLook(role)}
                        ></Button>
                        <Link to={`/editRole/${currentArea.id}/${role.id}`}>
                            <Button
                            rounded
                            severity="success"
                            className="mr-2"
                            icon="pi pi-pencil"
                            ></Button>
                        </Link>
                        <Link to={`/activities/${role.id}`}>
                            <Button
                            rounded
                            severity="info"
                            icon="pi pi-arrow-right"
                            ></Button>
                        </Link>
                        </div>
                    </div>
                    </div>
                ))}
                {roles.length === 0 ? (
                    <p className="text-2xl text-blue-500 m-10">
                    Aún no hay cargos en esta área{" "}
                    </p>
                ) : (
                    ""
                )}
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
            <ul>
              {role?.hardSkills.map((skill) => (
                <li>- {skill}</li>
              ))}
            </ul>
          </TabPanel>
          <TabPanel header="Blandas">
            <ul>
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
