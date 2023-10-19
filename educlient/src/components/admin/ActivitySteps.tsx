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
import axios from "axios";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

interface testInputs {
  formURL: string;
  excelURL: string;
}

function ActivitySteps() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const steps = useSelector((state: RootState) => state.steps.steps);
  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const role = useSelector((state: RootState) => state.roles.currentRole);

  const [layout, setLayout] = useState<LayoutType>("list");
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [stepId, setStepId] = useState(0);
  const [checked, setChecked] = useState<boolean>(false);
  const [testUrls, setTestUrls] = useState<testInputs | Object>({});
  const [showAddTestModal, setShowAddTestModal] = useState<boolean>(false);
  const initialTime = new Date();
  initialTime.setHours(0);
  initialTime.setMinutes(0);
  const [time, setTime] =
    useState<Nullable<string | Date | Date[]>>(initialTime);

  const toast = useRef<Toast>(null);

  const handleChangeTestUrls = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTestUrls({
      ...testUrls,
      [name]: value,
    });
  };

  useEffect(() => {
    dispatch(getStepsActivity(Number(id)));
  }, []);

  const name = activities.find((activity) => activity.id === Number(id));

  const dataViewHeader = (
    <div className="flex md:flex-row md:justify-content-between items-center">
      <p className="text-5xl m-0">
        {name ? name.title : "No se encontró la actividad"}
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
        <div className="flex flex-column md:flex-row align-items-center py-2 w-full">
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
      <div className="col-12 px-3 lg:col-4">
        <div className="card my-3 border-1 surface-border">
          <div className="flex flex-column align-items-center text-center mb-3 mx-3">
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
          id: id,
          hasTest: true,
          durationTest: duration,
          ...testUrls,
        };
      } else {
        urlsData = {
          id: id,
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
        onClick={handleAddTest}
        text
        autoFocus
      />
    </>
  );

  return (
    <>
      <Toast ref={toast} />
      <div className="list-demo relative pt-2">
        <div className="col-12">
          <div className="card h-[700px] overflow-auto">
            <div className="py-2">
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
            <div className="flex justify-content-between">
              <div className="flex align-items-start">
                <Link to={`/addStep/${id}`}>
                  <Button label="+ Crear Paso" severity="info" rounded />
                </Link>
              </div>
              <div className="flex align-items-end">
                <Button
                  label="+ Agregar test"
                  severity="info"
                  rounded
                  onClick={() => setShowAddTestModal(true)}
                />
              </div>
            </div>
          </div>
        </div>
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
        header="Agregar test"
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
              // value={testUrls.formURL}
              placeholder="URL"
              onChange={handleChangeTestUrls}
            />
          </div>
          <div className="field flex flex-col">
            <label>Excel</label>
            <InputText
              type="text"
              name="excelURL"
              // value={testUrls.excelURL}
              placeholder="URL"
              onChange={handleChangeTestUrls}
            />
          </div>
          <div className="field flex gap-2">
            <InputSwitch
              checked={checked}
              onChange={(e: InputSwitchChangeEvent) =>
                setChecked(e.value ?? false)
              }
            />
            <label>Agregar tiempo al Test</label>
          </div>
          {checked ? (
            <div className="flex-auto">
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
        </div>
      </Dialog>
    </>
  );
}

export default ActivitySteps;
