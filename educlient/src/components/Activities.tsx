import React, { useState, useEffect } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { LayoutType, SortOrderType } from "../utils/types/types";
import { getStepsActivity } from "../redux/features/stepsSlider";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { Activity } from "../utils/interfaces";
import { useAppDispatch } from "../hooks/typedSelectors";
import axios from "axios";

const Activities = () => {
  const dispatch = useAppDispatch();

  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const activeActivities = activities.filter((act) => act.active === true);

  const [dataViewValue, setDataViewValue] = useState<Activity[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filteredValue, setFilteredValue] = useState<Activity[]>([]);
  const [layout, setLayout] = useState<LayoutType>("list");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState<SortOrderType>(0);
  const [sortField, setSortField] = useState("");
  const [userSteps, setUserSteps] = useState([]);
  const [totalSteps, setTotalSteps] = useState([]);
  const currentUser = useSelector((state: RootState) => state.user.logUser);
  const totalCurrentActivities = useSelector(
    (state: RootState) => state.activities.activities
  );

  const currentProgress = userSteps.filter(
    (entrada) => entrada.UserId === currentUser.id
  );
  const pendingSteps = userSteps.filter(
    (paso) => paso.UserId === currentUser.id && !paso.finished
  );
  const sortOptions = [
    { label: "A - Z", value: "title" },
    { label: "Z - A", value: "!title" },
  ];

  useEffect(() => {
    setDataViewValue(activeActivities);
    setGlobalFilterValue("");
  }, [activities]);

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setGlobalFilterValue(value);
    const filtered = dataViewValue.filter((act) =>
      act.title.toLowerCase().includes(value)
    );
    setFilteredValue(filtered);
  };

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }

    const sortedData = [
      ...(filteredValue.length > 0 ? filteredValue : dataViewValue),
    ].sort((a, b) => {
      const fieldA = a.title.toLowerCase();
      const fieldB = b.title.toLowerCase();

      if (fieldA < fieldB) {
        return -1 * sortOrder;
      }
      if (fieldA > fieldB) {
        return 1 * sortOrder;
      }
      return 0;
    });

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

  // console.log(
  //   "'currentProgress' del usuario actual:",
  //   currentProgress,
  //   "'totalCurrentActivities' las actividades del usuario:",
  //   totalCurrentActivities,
  //   "Todos los pasos de las actividades",
  //   totalSteps,
  //   "'totalSteps' del empleado actual:",
  //   pendingSteps
  // );

  // Crear un objeto para almacenar la información de los ActivityIds finalizados
  const finishedActivityInfo = {};

  // Filtrar los pasos finalizados
  const finishedSteps = currentProgress.filter((step) => step.finished);

  // Contar la cantidad de pasos por activityId en totalSteps
  finishedSteps.forEach((step) => {
    const { StepId } = step;

    // Encontrar el step correspondiente en totalSteps
    const matchingStep = totalSteps.find((ts) => ts.id === StepId);

    if (matchingStep) {
      const { activityId, title } = matchingStep;

      // Verificar si el activityId ya está en el objeto finishedActivityInfo
      if (finishedActivityInfo.hasOwnProperty(activityId)) {
        finishedActivityInfo[activityId].count++;
      } else {
        // Obtener la cantidad total de pasos para esta actividad
        const totalStepsForActivity = totalSteps.filter(
          (ts) => ts.activityId === activityId
        ).length;

        finishedActivityInfo[activityId] = {
          title: title,
          count: totalStepsForActivity,
        };
      }
    }
  });

  // Obtener todos los StepId del usuario actual con finished: false
  const unfinishedStepIds = currentProgress
    .filter((step) => !step.finished)
    .map((step) => step.StepId);

  // Crear un objeto para almacenar los activityId
  const activityIds = {};

  // Iterar sobre los StepId no finalizados y obtener sus activityId
  unfinishedStepIds.forEach((stepId) => {
    const matchingStep = totalSteps.find((step) => step.id === stepId);
    if (matchingStep) {
      activityIds[matchingStep.activityId] = true;
    }
  });

  // Encontrar los activityId que no tienen ningún paso con finished: true
  const activityIdsWithNoStepsFinished = Object.keys(activityIds).filter(
    (activityId) => !(activityId in finishedActivityInfo)
  );
  // console.log(currentProgress);
  // // // Mostrar los activityId que cumplen con la condición
  // console.log("Todos los pasos de los usuarios y sus StepIds", totalSteps);

  console.log(activityIdsWithNoStepsFinished, finishedActivityInfo);
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
        <InputText
          value={globalFilterValue}
          onChange={(e) => onFilter(e)}
          placeholder="Buscar"
        />
      </span>
      <DataViewLayoutOptions
        layout={layout}
        onChange={(e) => setLayout(e.value as LayoutType)}
        className="m-0"
      />
    </div>
  );
  // Tengo que colocarles su UserSteps
  const dataviewListItem = (data: Activity) => {
    const activityId = data.id;

    // Comprobar si el activityId no se encuentra en activityIdsWithNoStepsFinished ni en finishedActivityInfo
    const notStarted =
      !activityIdsWithNoStepsFinished.includes(String(activityId)) &&
      !finishedActivityInfo[activityId];

    return (
      <div className="col-12 border-none">
        <Link to={`/activity/${data.id}`}>
          <div
            className={`flex flex-column my-3 border rounded-lg shadow-sm p-4 hover:bg-slate-100 ${
              notStarted ? "text-red-500" : ""
            }`}
          >
            <div className="text-2xl font-bold">
              <h3 className="m-0 flex align-items-center">
                {data.title}
                {notStarted ? (
                  <i className="pi pi-exclamation-circle text-4xl ml-2"></i>
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
      !finishedActivityInfo[activityId];

    return (
      <div className="col-12 lg:col-4">
        <Link to={`/activity/${data.id}`}>
          <div className="card m-3 border-1 surface-border hover:bg-slate-100">
            <div className="flex flex-column align-items-center text-center">
              <div className="text-2xl font-bold">
                <h3 className="m-0 flex-row align-items-center">
                  {data.title}
                  {notStarted ? (
                    <i className="pi pi-exclamation-circle text-4xl ml-2"></i>
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
            Pendientes:
          </h3>
          {activityIdsWithNoStepsFinished.map((activityId, index) => {
            // Obtener los pasos para la actividad actual
            const stepsForActivity = totalSteps.filter(
              (step) => step.activityId === parseInt(activityId)
            );

            // Encontrar los pasos que están en "currentProgress" del usuario actual
            const userStepsForActivity = currentProgress.filter((userStep) =>
              stepsForActivity.some((step) => step.id === userStep.StepId)
            );

            // Encontrar el ID más grande entre los pasos del usuario actual
            const maxStepId = Math.max(
              ...userStepsForActivity.map((userStep) => userStep.StepId)
            );

            // Encontrar el título de la actividad correspondiente a "activityId"
            const activityTitle =
              totalCurrentActivities.find(
                (activity) => activity.id === parseInt(activityId)
              )?.title || `Actividad Desconocida`; // Si no se encuentra el título, muestra "Actividad Desconocida"

            // Encontrar el nombre del paso correspondiente al ID más grande
            const stepName =
              stepsForActivity.find((step) => step.id === maxStepId)?.title ||
              `Step ${1}`;

            return (
              <div
                className="col-12 w-auto flex-wrap"
                id={`activities-list-${index}`}
                key={index}
              >
                <div className="card m-3 border-1 surface-border hover:bg-slate-100">
                  <h3 className="m-0">{`${activityTitle}: ${stepName}`}</h3>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="card flex mx-[5%]"
          id="finished-activities"
          style={{ overflowX: "auto" }}
        >
          <h3 className="flex align-items-center gap-2">
            <i className="pi pi-check-square text-4xl gap-2" />
            Finalizadas:
          </h3>
          {Object.keys(finishedActivityInfo).map((activityId, index) => {
            const currentActivity = totalCurrentActivities.find(
              (activity) => activity.id === parseInt(activityId)
            );

            if (!currentActivity) {
              // Manejar el caso en el que no se encuentra la actividad actual
              return null;
            }
            return (
              <div
                className="col-12 w-auto flex-wrap"
                id={`activities-list-${index}`}
                key={index}
              >
                <div className="card m-3 border-1 surface-border hover:bg-slate-100">
                  <h3 className="m-0">
                    {currentActivity.title}:{" "}
                    {`${finishedActivityInfo[activityId].title}`}
                  </h3>
                  {/* para colocar ticks por cantidad de pasos, esta es la variable ${finishedActivityInfo[activityId].count} */}
                </div>
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
            value={filteredValue.length > 0 ? filteredValue : dataViewValue}
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
