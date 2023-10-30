import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Doughnut } from "react-chartjs-2";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import {
  TestGrade,
  GradePercentage,
  EmployeeQualification,
} from "../../utils/interfaces";
import styles from "./ListEmployeesQuealifications.module.css";

function ListEmployeesQualifications() {
  const { activityId } = useParams();
  const logUser = useSelector((state: RootState) => state.user.logUser);
  const [employeesQualifications, setEmployeesQualifications] = useState<
    EmployeeQualification[]
  >([]);
  const [percentageGrades, setPercentageGrades] = useState<number>(0);
  const [activityTitle, setActivityTitle] = useState<string>("");
  let remainingPercentage: number = 100 - percentageGrades;
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<EmployeeQualification[]>(
    []
  );
  const emptyUserTestGrade: EmployeeQualification = {
    idTestGrade: 0,
    gradeValue: "0",
    maximunGradeValue: "0",
  };

  const [testGrade, setTestGrade] =
    useState<EmployeeQualification>(emptyUserTestGrade);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<EmployeeQualification[]>>(null);

  useEffect(() => {
    const getEmployeesQualifications = async () => {
      try {
        const response = await axios(
          `http://localhost:3001/admin/employeesGrades/${logUser.id}/${activityId}`
        );

        if (response.data) {
          let result: object[] = response.data;
          let percentageTotal: GradePercentage | undefined =
            result?.shift() as GradePercentage;
          setPercentageGrades(percentageTotal?.gradePercentage);
          setActivityTitle(percentageTotal?.activityName);
          setEmployeesQualifications(response.data);
        } else {
          console.error("No hay calificaciones para esta actividad.");
        }
      } catch (error) {
        console.error("Error al obtener datos de las calificaciones:", error);
      }
    };
    if (logUser.id !== 0) {
      getEmployeesQualifications();
    }
  }, [isUpdated, logUser.id]);

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const saveUser = async () => {
    setSubmitted(true);
    if (testGrade.gradeValue && testGrade.maximunGradeValue) {
      let newQualification = {
        id: testGrade.idTestGrade,
        gradeValue: parseInt(testGrade.gradeValue),
        maximunGradeValue: parseInt(testGrade.maximunGradeValue),
        errorTest: false,
        userId: testGrade.idUser,
      };
      try {
        const { data } = await axios.patch(
          "http://localhost:3001/test/update",
          newQualification
        );
        if (data) {
          setIsUpdated(!isUpdated);
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Calificación Actualizada.",
            life: 3000,
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error al actualizar los datos.",
            detail: "Inténtelo nuevamente.",
            life: 3000,
          });
        }
      } catch (error: any) {
        console.log(error);
      }
      setUserDialog(false);
      setTestGrade(emptyUserTestGrade);
    }
  };

  const editUser = (testGrade: EmployeeQualification) => {
    setTestGrade({ ...testGrade });
    setUserDialog(true);
  };

  const confirmDeleteUser = (testGrade: EmployeeQualification) => {
    setTestGrade(testGrade);
    setDeleteUserDialog(true);
  };

  const deleteUser = () => {
    let restTestGrades;
    if (testGrade) {
      restTestGrades = employeesQualifications.filter(
        (val) => val.idUser !== testGrade.idUser
      );
      const deleteTestGrade = async () => {
        try {
          const response = await axios.delete(
            `http://localhost:3001/test/${logUser.id}/${testGrade.idTestGrade}`
          );
          if (response.data) {
            setIsUpdated(!isUpdated);
            toast.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Calificación eliminada.",
              life: 3000,
            });
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "No se ha encontrado un registro de Evaluación.",
              life: 3000,
            });
          }
        } catch (error) {
          console.error("Error al eliminar la Evaluación:", error);
        }
      };
      deleteTestGrade();
      setDeleteUserDialog(false);
      setTestGrade(emptyUserTestGrade);
      setEmployeesQualifications(restTestGrades);
    }
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const deleteSelectedUsers = () => {
    let restTestGrades;
    if (selectedUsers.length > 1) {
      const testGradeIdsToDelete = selectedUsers.map(
        (user) => user.idTestGrade
      );

      // Elimina los testGrades usando Promise.all para manejar las solicitudes de eliminación de manera asíncrona y devuelve el id del testGrade eliminado
      const deletePromises = testGradeIdsToDelete.map(async (testGradeId) => {
        try {
          await axios.delete(
            `http://localhost:3001/test/${logUser.id}/${testGradeId}`
          );
          return testGradeId;
        } catch (error) {
          console.error("Error al eliminar la Evaluación:", error);
          return null;
        }
      });

      // Espera a que se completen todas las solicitudes de eliminación, luego filtra los resultados para eliminar testGrades nulos (errores)
      Promise.all(deletePromises)
        .then((deletedTestGrades) => {
          const successfullyDeletedTestGrades = deletedTestGrades.filter(
            (id) => id !== null
          );

          if (successfullyDeletedTestGrades.length > 0) {
            toast.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Calificaciones eliminadas.",
              life: 3000,
            });

            restTestGrades = employeesQualifications.filter((val) => {
              return !successfullyDeletedTestGrades.includes(val.idTestGrade);
            });

            setEmployeesQualifications(restTestGrades);
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "No se ha encontrado ningún registro de Evaluación.",
              life: 3000,
            });
          }
        })
        .catch((error) => {
          console.error("Error al eliminar una o más Evaluaciones:", error);
        });
      setSelectedUsers([]);
      setDeleteUsersDialog(false);
      setTestGrade(emptyUserTestGrade);
    }
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: keyof TestGrade
  ) => {
    const { value } = e.target;
    setTestGrade((prevState: EmployeeQualification) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const usernameBodyTemplate = (rowData: EmployeeQualification) => {
    return <div className=" pl-3">{rowData.username}</div>;
  };

  const punctuationBodyTemplate = (rowData: EmployeeQualification) => {
    return (
      <div className=" pl-4">
        {rowData.gradeValue === null && rowData.maximunGradeValue === null ? (
          <p>0/0</p>
        ) : (
          <p>
            {rowData.gradeValue}/{rowData.maximunGradeValue}
          </p>
        )}
      </div>
    );
  };

  const percentageBodyTemplate = (rowData: EmployeeQualification) => {
    let gradeValue = rowData.gradeValue?.toString();
    let maximunGradeValue = rowData.maximunGradeValue;
    let gradePercentage;

    if (gradeValue === "0") {
      gradePercentage = "0";
    } else {
      if (gradeValue && maximunGradeValue) {
        let gradeValueAux = parseInt(gradeValue);
        let maximunGradeValueAux = parseInt(maximunGradeValue);
        let aux = parseFloat(
          ((gradeValueAux / maximunGradeValueAux) * 100).toFixed(2)
        );
        gradePercentage = aux.toString();
      }
    }
    return <div className=" pl-4">{gradePercentage}%</div>;
  };

  const statusBodyTemplate = (rowData: EmployeeQualification) => {
    return (
      <div className="">
        <span
          key={rowData.idTestGrade}
          className={`p-badge p-mr-1 h-auto ${
            rowData.errorTest ? "bg-red-700" : "bg-green-700"
          }`}
        >
          {rowData.errorTest ? "Error Test" : "Completado"}
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: EmployeeQualification) => {
    return (
      <>
        <div className="flex">
          <Button
            icon="pi pi-pencil"
            rounded
            disabled={selectedUsers.length > 1 ? true : false}
            className="mr-1 p-button-success"
            onClick={() => editUser(rowData)}
          />
          <Button
            icon="pi pi-trash"
            rounded
            className="p-button-danger"
            disabled={selectedUsers.length > 1 ? true : false}
            onClick={() => confirmDeleteUser(rowData)}
          />
        </div>
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <div className=" flex gap-2 items-center">
        <Button onClick={() => setInfoVisible(true)} severity="info">
          <i className="pi pi-exclamation-circle w-[30px] md:w-[26px] text-md md:text-2xl"></i>
        </Button>
        <h5 className="m-0 text-base lg:text-2xl">Gestionar Evaluados</h5>
      </div>
      <div className="  sm:flex flex-col-reverse  md:flex-row gap-2 hidden ">
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedUsers || selectedUsers.length < 2}
        />
        <span className="block mt-2 md:mt-0 p-input-icon-left ">
          <i className="pi pi-search" />
          <InputText
            type="search"
            className=" w-[100%]"
            onInput={(e) => setGlobalFilter(e.currentTarget.value)}
            placeholder="Buscar por nombre..."
          />
        </span>
      </div>
    </div>
  );

  const userDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" text onClick={saveUser} />
    </>
  );
  const deleteUserDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteUserDialog}
      />
      <Button label="Sí" icon="pi pi-check" text onClick={deleteUser} />
    </>
  );
  const deleteUsersDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteUsersDialog}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        text
        onClick={deleteSelectedUsers}
      />
    </>
  );

  // Config. Donuts
  const data = {
    labels: ["Porcentaje Completado", "Porcentaje Restante"],
    datasets: [
      {
        data: [percentageGrades, remainingPercentage],
        backgroundColor: ["#28A5D7", "#C4C4C4"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div className="flex ml-2">
      <Toast ref={toast} />
      <div className="col-12 align-items-center lg:h-full lg:py-2">
        <section className="card justify-content-center overflow-hidden py-0 gird grid-cols-3 md:h-full w-[100%] lg:pb-4 lg:mt-2">
          <div className=" h-[140px] sm:h-[100px]  gap-2  w-[100%] flex flex-col-reverse  sm:items-center sm:flex-row sm:justify-evenly md:px-6 md:gap-0 md:h-[84px]">
            <Link to={"/evaluationsList"} className="no-underline">
              {/* <i
                className="pi pi-arrow-left text-xl sm:text-2xl lg:text-3xl xl:text-4xl"
                style={{  color: "grey" }}
              ></i> */}
              <Button
                icon=" pi pi-angle-double-left md:flex "
                label="Atrás"
                className="m-2  mt-3 sm:mt-2 ml-2  h-[40px] text-xs w-[84px] md:w-[100px] md:h-[50px] md:text-base"
                rounded
                severity="secondary"
              />
            </Link>
            <p className=" text-xl md:text-2xl lg:text-4xl text-cyan-800  text-center md:flex-grow">
              Evaluación de: {activityTitle}
            </p>
          </div>

          <div className="flex flex-col justify-center items-center gap-4 my-3 sm:my-0 md:flex-row md:justify-between md:gap-0 md:my-4 md:h-[210px] w-[100%]">
            <div className=" flex flex-col items-center w-[277px] h-[200px] md:max-w-[230px] bg-slate-200 rounded-2xl text-center lg:max-w-[240px]">
              <p className=" text-xl lg:text-2xl text-cyan-800 mt-2">
                # Respuestas
              </p>
              <p className=" text-6xl h-[160px] md:text-7xl text-black sm:h-[133px] py-6 sm:py-5">
                {employeesQualifications.length}
              </p>
            </div>
            <div className=" flex flex-col items-center text-center w-[277px] h-[200px] md:max-w-[320px] md:mx-2 bg-slate-200 rounded-2xl lg:w-[340px]">
              <p className=" text-xl lg:text-2xl text-cyan-800 mt-2">
                Porcentaje de Aprobación
              </p>
              <div className="relative w-[48%] sm:w-[48%] md:w-[50%] lg:w-[40%]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-md font-semibold text-gray-800">
                    {percentageGrades}%
                  </p>
                </div>
                <Doughnut data={data} options={options} />
              </div>
            </div>
            <div className=" flex flex-col items-center w-[277px] h-[200px] md:max-w-[230px] bg-slate-200  rounded-2xl lg:max-w-[240px]">
              <p className=" text-xl lg:text-2xl text-cyan-800 mt-2">
                # Errores Tests
              </p>
              <p className=" text-6xl md:text-7xl text-black h-[160px] sm:h-[133px] py-6 sm:py-5">
                {
                  employeesQualifications.filter(
                    (employee) => employee.errorTest
                  ).length
                }
              </p>
            </div>
          </div>

          <div className=" h-[584px] flex items-center justify-center md:h-[526px]">
            <div className=" card h-[96%] w-full mb-4 mt-4 md:mt-0 md:mb-0">
              <DataTable
                ref={dt}
                value={employeesQualifications}
                selection={selectedUsers}
                onSelectionChange={(e) =>
                  setSelectedUsers(e.value as EmployeeQualification[])
                }
                dataKey="idTestGrade"
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} evaluados"
                globalFilter={globalFilter}
                emptyMessage="No se encontraron usuarios evaluados."
                header={header}
                scrollable
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: "4rem" }}
                  frozen
                  className={styles.hiddenSmall}
                ></Column>
                <Column
                  field="username"
                  header="Evaluado"
                  sortable
                  body={usernameBodyTemplate}
                ></Column>
                <Column
                  field="errorTest"
                  header="Estado"
                  sortable
                  className={styles.hiddenSmall}
                  body={statusBodyTemplate}
                ></Column>
                <Column
                  field="punctuation"
                  header="Puntuación"
                  body={punctuationBodyTemplate}
                ></Column>
                <Column
                  field="gradePercentage"
                  header="Porcentaje"
                  className={styles.hiddenSmall}
                  body={percentageBodyTemplate}
                ></Column>
                <Column
                  body={actionBodyTemplate}
                  field="edit"
                  header="Editar/Eliminar"
                  alignFrozen="right"
                ></Column>
              </DataTable>
              <Dialog
                visible={userDialog}
                header={
                  testGrade.idTestGrade !== 0
                    ? "Editar Calificación"
                    : "Error: Calificación no encontrada"
                }
                modal
                className="p-fluid w-[340px] md:w-[450px]"
                footer={userDialogFooter}
                onHide={hideDialog}
              >
                <div className="field">
                  <p>
                    Usuario seleccionado: <b>{testGrade.username}</b>
                  </p>
                  <label htmlFor="gradeValue">Calificación</label>
                  <InputText
                    id="gradeValue"
                    value={testGrade.gradeValue}
                    onChange={(e) => onInputChange(e, "gradeValue")}
                    required
                    autoFocus
                    className={classNames({
                      "p-invalid": submitted && !testGrade.gradeValue,
                    })}
                  />
                  {submitted && !testGrade.gradeValue && (
                    <small className="p-error">
                      La calificación es un dato obligatorio.
                    </small>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="maximunGradeValue">Calificación Maxima</label>
                  <InputText
                    id="maximunGradeValue"
                    value={testGrade.maximunGradeValue}
                    onChange={(e) => onInputChange(e, "maximunGradeValue")}
                    required
                    className={classNames({
                      "p-invalid": submitted && !testGrade.maximunGradeValue,
                    })}
                  />
                  {submitted && !testGrade.maximunGradeValue && (
                    <small className="p-error">
                      La calificación máxima es un dato obligatorio.
                    </small>
                  )}
                </div>
              </Dialog>

              <Dialog
                visible={deleteUserDialog}
                className="w-[340px] md:w-[450px]"
                header="Confirmar"
                modal
                footer={deleteUserDialogFooter}
                onHide={hideDeleteUserDialog}
              >
                <div className="flex items-center justify-center">
                  <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                  />
                  {testGrade && (
                    <div className=" flex flex-col gap-1 pt-4 md:pt0">
                      <span>
                        ¿Estás seguro que deseas eliminar el registro de
                        evaluación del usuario <b>{testGrade?.username}</b>?
                      </span>
                      <b>
                        {" "}
                        En este caso, el Test correspondiente se habilitará.
                      </b>
                    </div>
                  )}
                </div>
              </Dialog>

              <Dialog
                visible={deleteUsersDialog}
                header="Confirmar"
                className="w-[30vw]"
                modal
                footer={deleteUsersDialogFooter}
                onHide={hideDeleteUsersDialog}
              >
                <div className="flex items-center justify-center">
                  <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                  />
                  {selectedUsers.length > 1 && (
                    <div className=" flex flex-col gap-1">
                      <span>
                        ¿Estás seguro que deseas eliminar los registros de
                        evualuación de los usuarios seleccionados?
                      </span>
                      <b>
                        {" "}
                        En este caso, los Tests correspondientes se habilitarán.
                      </b>
                    </div>
                  )}
                </div>
              </Dialog>
              <Dialog
                header="Información al administrador"
                visible={infoVisible}
                onHide={() => setInfoVisible(false)}
                className="p-fluid w-[340px] md:w-[500px]"
                modal
              >
                <div className="flex align-items-center justify-content-center">
                  <ul className="m-0 gap-4 text-lg text-slate-950">
                    <li className=" pb-4 sm:hidden text-center">
                      <b className=" text-red-700 ">
                      Le recomendamos girar la pantalla horizontalmente para ver todos los campos de la tabla.
                      </b>
                    </li>
                    <li className=" py-1">
                      Posibles casos del estado "Error Test":
                    </li>
                    <li className=" py-1">
                      Si el empleado sale del Test y no lo realizó o no lo
                      envió.
                    </li>
                    <li className=" py-1">
                      Si el empleado recarga la página y no envió el Test.
                    </li>
                    <li className=" py-1">
                      Si el empleado realiza el test, lo envia y luego recarga
                      la pagina.
                    </li>
                    <li className=" py-1">
                      Si el empleado ingresa un correo electrónico en el Test
                      que no coincide con el ingresado en Edupluss.
                    </li>
                    <li className=" py-1">
                      <b>
                        Cualquiera sea el caso, puede verificar los datos en el
                        excel correspondiente.
                      </b>
                    </li>
                  </ul>
                </div>
              </Dialog>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ListEmployeesQualifications;
