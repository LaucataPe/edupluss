import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getStepsActivity } from "../../redux/features/stepsSlider";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { LayoutType } from "../../utils/types/types";
import { Step } from "../../utils/interfaces";
import { setActivity } from "../../redux/features/activitiesSlice";
import axios from "axios";

import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

interface testInputs {
  formURL?: string;
  excelURL?: string;
}

function ActivitySteps() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  let idAux: number;
  if (id) {
    idAux = parseInt(id);
  }

  const steps = useSelector((state: RootState) => state.steps.steps);
  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const role = useSelector((state: RootState) => state.roles.currentRole);
  const toast = useRef<Toast>(null);
  const [layout, setLayout] = useState<LayoutType>("list");
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [stepId, setStepId] = useState(0);
  const [showAddTestModal, setShowAddTestModal] = useState<boolean>(false);
  const initialTime = new Date();
  initialTime.setHours(0);
  initialTime.setMinutes(0);

  useEffect(() => {
    dispatch(getStepsActivity(Number(id)));
  }, []);

  const currentActivity = activities.find(
    (activity) => activity.id === Number(id)
  );
  //console.log(currentActivity);

  const [checked, setChecked] = useState<boolean>(false);
  const [time, setTime] = useState<Nullable<string | Date | Date[]>>(
    currentActivity?.durationTest ? currentActivity.durationTest : initialTime
  );

  const [testUrls, setTestUrls] = useState<testInputs>({
    formURL: currentActivity?.formURL,
    excelURL: currentActivity?.excelURL,
  });

  useEffect(() => {
    setTestUrls({
      formURL: currentActivity?.formURL,
      excelURL: currentActivity?.excelURL,
    });
  }, [showAddTestModal]);

  const handleChangeTestUrls = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestUrls({
      ...testUrls,
      [name]: value,
    });
  };

  const dataViewHeader = (
    <div className="flex md:flex-row md:justify-content-between items-center">
      <p className="text-5xl m-0">
        {currentActivity
          ? currentActivity.title
          : "No se encontró la actividad"}
      </p>
      <DataViewLayoutOptions
        layout={layout}
        onChange={(e) => setLayout(e.value as LayoutType)}
      />
    </div>
  );

  const dialogHandler = (id: number) => {
    setDisplayConfirmation(true);
    setStepId(id);
  };

  const dataviewListItem = (data: Step) => {
    return (
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-center px-3 w-full">
          <img
            src="https://images.pexels.com/photos/15401447/pexels-photo-15401447/free-photo-of-texto-cartas-dados-fondo-blanco.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Foto Random"
            className="w-2 shadow-2 my-2 mx-0"
          />
          <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
            <span className="font-semibold"> Paso #{data.number}</span>
            <div className="font-bold text-xl">{data.title}</div>
          </div>
          <div className="car-buttons">
            <Link to={`/editStep/${data.activityId}/${data.id}`}>
              <Button
                rounded
                severity="success"
                className="mr-2"
                icon="pi pi-pencil"
              ></Button>
            </Link>
            <Button
              rounded
              severity="danger"
              icon="pi pi-times"
              onClick={() => dialogHandler(data.id ?? 0)}
            ></Button>
          </div>
        </div>
      </div>
    );
  };

  const dataviewGridItem = (data: Step) => {
    return (
      <div className="col-12 lg:col-4">
        <div className="card m-3 border-1 surface-border">
          <div className="flex flex-column align-items-center text-center mb-3">
            <img
              src="https://images.pexels.com/photos/15401447/pexels-photo-15401447/free-photo-of-texto-cartas-dados-fondo-blanco.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Foto Random"
              className="w-9 shadow-2 my-3 mx-0"
            />
            <span className="font-semibold"> Paso #{data.number}</span>
            <div className="text-xl font-bold">{data.title}</div>
          </div>
          <div className="car-buttons text-center">
            <Link to={`/editStep/${data.activityId}/${data.id}`}>
              <Button
                rounded
                severity="success"
                className="mr-2"
                icon="pi pi-pencil"
              ></Button>
            </Link>
            <Button
              rounded
              severity="danger"
              icon="pi pi-times"
              onClick={() => dialogHandler(data.id ?? 0)}
            ></Button>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (data: Step, layout: LayoutType) => {
    if (!data) {
      return;
    }

    if (layout === "list") {
      return dataviewListItem(data);
    } else if (layout === "grid") {
      return dataviewGridItem(data);
    }
  };

  const handleDelete = async () => {
    try {
      let response = await axios.delete(`http://localhost:3001/step/${stepId}`);
      let data = response.data;
      if (data) {
        dispatch(getStepsActivity(Number(id)));
        setDisplayConfirmation(false);
      }
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

  const handleAddTest = async () => {
    try {
      //Save auth token
      const auth = window.localStorage.getItem("token");

      //Format data to send
      let urlsData;
      if (time) {
        let duration;

        if (time instanceof Date) {
          // Get hours, minutes y seconds
          const hours = time.getHours().toString().padStart(2, "0");
          const minutes = time.getMinutes().toString().padStart(2, "0");
          //const seconds = time.getSeconds().toString().padStart(2, '0');
          const seconds = "00";
          duration = `${hours}:${minutes}:${seconds}`;
        }

        if (duration === "00:00:00") {
          duration = null;
        }

        urlsData = {
          id: idAux,
          hasTest: true,
          durationTest: duration,
          ...testUrls,
        };
      } else {
        urlsData = {
          id: idAux,
          hasTest: true,
          ...testUrls,
        };
      }

      const response = await axios.patch(
        "http://localhost:3001/activity/update",
        urlsData,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      if (response) {
        //console.log(response.data);
        dispatch(setActivity(response.data));
        toast.current?.show({
          severity: "success",
          summary: "Agregado!",
          detail: "Test actualizado",
          life: 2000,
        });
        setTimeout(() => {
          setShowAddTestModal(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.current?.show({
        severity: "error",
        summary: "Algo salio mal",
        detail: "Intentalo mas tarde",
        life: 2000,
      });
      setTimeout(() => {
        setShowAddTestModal(false);
      }, 2000);
    }
  };

  const confirmationModalFooter = (
    <>
      <Button
        type="button"
        label="Descartar"
        icon="pi pi-times"
        onClick={() => setShowAddTestModal(false)}
        text
      />
      <Button
        type="button"
        label="Guardar"
        icon="pi pi-check"
        //! Solo controlo que se ingrese 1 disabled={ time && (testUrls.excelURL === null || testUrls.excelURL === "") && (testUrls.formURL === null || testUrls.formURL === "") ? true : false}
        disabled={
          time &&
          (testUrls.excelURL === null ||
            testUrls.excelURL === "" ||
            testUrls.formURL === null ||
            testUrls.formURL === "")
            ? true
            : false
        }
        onClick={handleAddTest}
        text
        autoFocus
      />
    </>
  );

  return (
    <>
      <Toast ref={toast} />

      <div className="list-demo relative">
        <div className="col-12 m-2">
          <div className="card h-[820px] mb-6 overflow-auto">
            <div className="py-4">
              <Link to={`/activities/${role.id}`}>
                <Button
                  icon="pi pi-angle-double-left"
                  label="Atrás"
                  className="mt-3 mx-2"
                  rounded
                  severity="secondary"
                />
              </Link>
            </div>
            <DataView
              value={steps}
              emptyMessage="No hay pasos en este actividad"
              layout={layout}
              rows={9}
              itemTemplate={itemTemplate}
              header={dataViewHeader}
            ></DataView>
          </div>
        </div>
        <Link to={`/addStep/${id}`}>
          <Button
            label="+ Crear Paso"
            severity="info"
            rounded
            className="absolute right-4 my-2 bottom-14"
          />
        </Link>
        <Button
          label={
            currentActivity?.formURL && currentActivity.excelURL
              ? "+ Editar Test"
              : "+ Agregar Test"
          }
          severity="info"
          rounded
          className="absolute left-6 my-2 bottom-14"
          onClick={() => setShowAddTestModal(true)}
        />
      </div>

      <Dialog
        header="Eliminar Paso"
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
          <span>¿Estás seguro que desea eliminar este paso?</span>
        </div>
      </Dialog>

      <Dialog
        header={
          currentActivity?.excelURL || currentActivity?.formURL
            ? "Editar Test"
            : "Agregar Test"
        }
        visible={showAddTestModal}
        onHide={() => setShowAddTestModal(false)}
        style={{ width: "450px" }}
        modal
        footer={confirmationModalFooter}
      >
        <div className="flex flex-col justify-start">
          <div className="field flex flex-col">
            <label>Formulario</label>
            <InputText
              type="text"
              name="formURL"
              value={testUrls?.formURL}
              placeholder="URL"
              onChange={(e) => handleChangeTestUrls(e)}
            />
          </div>
          <div className="field flex flex-col">
            <label>Excel</label>
            <InputText
              type="text"
              name="excelURL"
              value={testUrls?.excelURL}
              placeholder="URL"
              onChange={(e) => handleChangeTestUrls(e)}
            />
          </div>
          <div className="field flex gap-2">
            <InputSwitch
              checked={checked}
              onChange={(e: InputSwitchChangeEvent) =>
                setChecked(e.value ?? false)
              }
            />
            <label>
              {currentActivity?.durationTest
                ? "Modificar duración del Test"
                : "Agregar duración al Test"}
            </label>
          </div>
          {checked ? (
            <div className="flex-auto">
              <p className=" text-red-600">
                Duración actual: {currentActivity?.durationTest}
              </p>
              <label htmlFor="calendar-timeonly" className=" block mb-2">
                Duración - Horas : Minutos
              </label>
              <Calendar
                id="calendar-timeonly"
                value={time}
                onChange={(e) => setTime(e.value)}
                timeOnly
              />
            </div>
          ) : null}
          <div className=" min-h-[30px]">
            {confirmationModalFooter.props.children[1].props.disabled ? (
              <p className="p-error">Ingrese la URL del formulario y excel.</p>
            ) : null}
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default ActivitySteps;
