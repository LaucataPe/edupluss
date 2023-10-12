import React, { useState, useEffect } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { LayoutType, SortOrderType } from "../utils/types/types";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { Activity } from "../utils/interfaces";
import axios from "axios";

const Activities = () => {
  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const activeActivities = activities.filter((act) => act.active === true);

  const [dataViewValue, setDataViewValue] = useState<Activity[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filteredValue, setFilteredValue] = useState<Activity[]>([]);
  const [layout, setLayout] = useState<LayoutType>("list");
  const [sortKey, setSortKey] = useState("all");
  const [sortOrder] = useState<SortOrderType>(0);
  const [sortField] = useState("");
  const [userSteps, setUserSteps] = useState([]);
  const [totalSteps, setTotalSteps] = useState([]);
  const currentUser = useSelector((state: RootState) => state.user.logUser);
  const totalCurrentActivities = useSelector(
    (state: RootState) => state.activities.activities
  );

  const currentProgress = userSteps.filter(
    //@ts-ignore
    (entrada) => entrada.UserId === currentUser.id
  );

  const sortOptions = [
    { label: "All", value: "all" },
    { label: "Finished", value: "finished" },
    { label: "Started", value: "started" },
    { label: "Not started", value: "notStarted" },
  ];

  useEffect(() => {
    setDataViewValue(activeActivities);
    setGlobalFilterValue("");
  }, [activities]);
  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    let sortedData = [...dataViewValue]; // Copiamos los datos originales
    const filters = {
      //@ts-ignore

      finished: (data) => {
        const activityId = data.id;
        return (
          //@ts-ignore

          finishedActivityInfo[activityId] && //@ts-ignore
          finishedActivityInfo[activityId].count > 0
        );
      }, //@ts-ignore

      started: (data) => {
        const activityId = data.id;
        const notInFinishedInfo =
          !finishedActivityInfo.hasOwnProperty(activityId);
        const hasSteps = totalSteps.some(
          //@ts-ignore

          (step) => step.activityId === activityId
        );
        return notInFinishedInfo && hasSteps;
      }, //@ts-ignore

      notStarted: (data) => {
        const activityId = data.id;
        const notStarted =
          !activityIdsWithNoStepsFinished.includes(String(activityId)) && //@ts-ignore
          !finishedActivityInfo[activityId];
        return notStarted;
      }, //@ts-ignore

      all: (data) => true,
    };

    if (value in filters) {
      //@ts-ignore

      sortedData = sortedData.filter(filters[value]);
    }

    // Ordenamos los datos
    sortedData.sort((a, b) => {
      const notStartedA =
        !activityIdsWithNoStepsFinished.includes(String(a.id)) &&
        //@ts-ignore
        !finishedActivityInfo[a.id];
      const notStartedB =
        !activityIdsWithNoStepsFinished.includes(String(b.id)) && //@ts-ignore
        !finishedActivityInfo[b.id];
      const isFinishedA = //@ts-ignore
        finishedActivityInfo[a.id] && finishedActivityInfo[a.id].count > 0;
      const isFinishedB = //@ts-ignore
        finishedActivityInfo[b.id] && finishedActivityInfo[b.id].count > 0;

      if (notStartedA && !isFinishedA) {
        return -1 * sortOrder;
      }
      if (notStartedB && !isFinishedB) {
        return 1 * sortOrder;
      }
      return 0;
    });

    setSortKey(value);
    setFilteredValue(sortedData);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/userStep");
        setUserSteps(response.data);
      } catch (error) {
        console.error("Error al obtener datos de UserSteps:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/steps");
        setTotalSteps(response.data);
      } catch (error) {
        console.error("Error al obtener datos de 'steps':", error);
      }
    };
    fetchData();
  }, []);

  const finishedActivityInfo = {};

  // Filtrar los pasos finalizados
  //@ts-ignore
  const finishedSteps = currentProgress.filter((step) => step.finished);

  // Contar la cantidad de pasos por activityId en totalSteps
  finishedSteps.forEach((step) => {
    const { StepId } = step;

    // Encontrar el step correspondiente en totalSteps
    //@ts-ignore
    const matchingStep = totalSteps.find((ts) => ts.id === StepId);

    if (matchingStep) {
      const { activityId, title } = matchingStep;

      // Verificar si el activityId ya está en el objeto finishedActivityInfo
      if (finishedActivityInfo.hasOwnProperty(activityId)) {
        //@ts-ignore
        finishedActivityInfo[activityId].count++;
      } else {
        // Obtener la cantidad total de pasos para esta actividad
        const totalStepsForActivity = totalSteps.filter(
          //@ts-ignore
          (ts) => ts.activityId === activityId
        ).length;
        //@ts-ignore
        finishedActivityInfo[activityId] = {
          title: title,
          count: totalStepsForActivity,
        };
      }
    }
  });

  // Obtener todos los StepId del usuario actual con finished: false
  const unfinishedStepIds = currentProgress
    //@ts-ignore
    .filter((step) => !step.finished)
    //@ts-ignore
    .map((step) => step.StepId);

  // Crear un objeto para almacenar los activityId
  const activityIds = {};

  // Iterar sobre los StepId no finalizados y obtener sus activityId
  unfinishedStepIds.forEach((stepId) => {
    //@ts-ignore
    const matchingStep = totalSteps.find((step) => step.id === stepId);
    if (matchingStep) {
      //@ts-ignore
      activityIds[matchingStep.activityId] = true;
    }
  });

  // Encontrar los activityId que no tienen ningún paso con finished: true
  const activityIdsWithNoStepsFinished = Object.keys(activityIds).filter(
    (activityId) => !(activityId in finishedActivityInfo)
  );

  const dataViewHeader = (
    <div className="flex flex-column md:flex-row md:justify-content-between gap-2 rounded-lg">
      <Dropdown
        value={sortKey}
        options={sortOptions}
        optionLabel="label"
        placeholder="Ordenar"
        onChange={onSortChange}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={globalFilterValue} placeholder="Buscar" />
      </span>
      <DataViewLayoutOptions
        layout={layout}
        onChange={(e) => setLayout(e.value as LayoutType)}
        className="m-0"
      />
    </div>
  );
  // Tengo que colocarles su UserSteps

  const dataviewListItem = (filteredValue: Activity) => {
    const activityId = filteredValue.id;

    // Comprobar si el activityId no se encuentra en activityIdsWithNoStepsFinished ni en finishedActivityInfo
    const notStarted =
      !activityIdsWithNoStepsFinished.includes(String(activityId)) &&
      //@ts-ignore
      !finishedActivityInfo[activityId];

    const isFinished = //@ts-ignore
      finishedActivityInfo[activityId] && //@ts-ignore
      finishedActivityInfo[activityId].count > 0; // Verifica si hay pasos finalizados

    return (
      <div className={`col-12 border-none`}>
        <Link to={`/activity/${filteredValue.id}`}>
          <div
            className={`flex flex-column my-3 border rounded-lg shadow-sm p-4 ${
              isFinished ? "bg-green-200" : notStarted ? "bg-blue-200" : ""
            } hover:bg-slate-00 ${notStarted ? "text-red-500" : ""}`}
          >
            <div className="text-2xl font-bold ">
              <h3 className="m-0 flex align-items-center">
                {filteredValue.title}
                {notStarted ? (
                  <i className="pi pi-exclamation-circle text-4xl ml-2"></i>
                ) : isFinished ? ( // Agrega la verificación para mostrar "ACTIVIDAD FINALIZADA"
                  <i className="pi pi-check-circle text-4xl ml-2"></i>
                ) : (
                  <i className="pi pi-lock-open text-4xl ml-2"></i>
                )}
              </h3>
            </div>
          </div>
        </Link>
      </div>
    );
  };
  const dataviewGridItem = (data: Activity) => {
    const activityId = data.id;

    // Comprobar si el activityId no se encuentra en activityIdsWithNoStepsFinished ni en finishedActivityInfo
    const notStarted =
      !activityIdsWithNoStepsFinished.includes(String(activityId)) &&
      //@ts-ignore
      !finishedActivityInfo[activityId];

    const isFinished =
      //@ts-ignore
      finishedActivityInfo[activityId] &&
      //@ts-ignore
      finishedActivityInfo[activityId].count > 0; // Verifica si hay pasos finalizados

    return (
      <div className="col-12 lg:col-4">
        <Link to={`/activity/${data.id}`}>
          <div
            className={`card m-3 border-1 surface-border hover:bg-slate-100 ${
              isFinished ? "bg-green-200" : notStarted ? "bg-blue-200" : ""
            }`}
          >
            <div className="flex flex-column align-items-center text-center">
              <div className="text-2xl font-bold">
                <h3 className="m-0 flex-row align-items-center">
                  {data.title}
                  {notStarted ? (
                    <i className="pi pi-exclamation-circle text-4xl ml-2"></i>
                  ) : isFinished ? ( // Agrega la verificación para mostrar "ACTIVIDAD FINALIZADA"
                    <i className="pi pi-check-circle text-4xl ml-2"></i>
                  ) : (
                    <i className="pi pi-lock-open text-4xl ml-2"></i>
                  )}
                </h3>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const itemTemplate = (data: Activity, layout: LayoutType) => {
    if (!data) {
      return null;
    }
    if (layout === "list") {
      return dataviewListItem(data);
    } else if (layout === "grid") {
      return dataviewGridItem(data);
    }

    return null;
  };
  return (
    <div className="grid list-demo">
      <div className="col-12">
        <div
          className="card flex mx-[5%]"
          id="pending-activities"
          style={{ overflowX: "auto" }}
        >
          <h3 className="flex align-items-center gap-2">
            <i className="pi pi-bookmark text-4xl gap-2" />
            Últimas actividades:
          </h3>
          {activityIdsWithNoStepsFinished
            .slice(-3) // Obtén los últimos 3 elementos del objeto
            .map((activityId, index) => {
              const stepsForActivity = totalSteps.filter(
                //@ts-ignore
                (step) => step.activityId === parseInt(activityId)
              );
              const userStepsForActivity = currentProgress.filter(
                (
                  userStep //@ts-ignore
                ) =>
                  stepsForActivity.some((step) => step.id === userStep.StepId)
              );
              const maxStepId = Math.max(
                //@ts-ignore
                ...userStepsForActivity.map((userStep) => userStep.StepId)
              );
              const activityTitle =
                totalCurrentActivities.find(
                  (activity) => activity.id === parseInt(activityId)
                )?.title || `Actividad Desconocida`; // Si no se encuentra el título, muestra "Actividad Desconocida"

              const stepName = //@ts-ignore
                stepsForActivity.find((step) => step.id === maxStepId)?.title ||
                `Paso ${1}`;

              const stepNameToFind = stepName; // Nombre del paso que deseas encontrar
              const stepWithActivityId = stepsForActivity.find(
                (step) => step.title === stepNameToFind
              );
              const activityIdForStepName = stepWithActivityId
                ? stepWithActivityId.activityId
                : null;

              return (
                <div
                  className="col-12 w-auto flex-wrap"
                  id={`activities-list-${index}`}
                  key={index}
                >
                  <Link to={`/activity/${activityIdForStepName}`}>
                    <div className="card m-3 border-1 surface-border bg-yellow-100 hover:bg-slate-100">
                      <h3 className="m-0">{`${activityTitle}: ${stepName}`}</h3>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
        <div className="card mx-[5%]">
          <h3>
            <i className="pi pi-book text-4xl mx-2" />
            Tus actividades:
          </h3>
          <DataView
            value={
              filteredValue.length > 0
                ? filteredValue
                : sortKey === "all"
                ? dataViewValue
                : []
            }
            layout={layout}
            paginator
            rows={9}
            sortOrder={sortOrder}
            sortField={sortField}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
          />
        </div>
      </div>
    </div>
  );
};

export default Activities;
