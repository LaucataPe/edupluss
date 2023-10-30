import React, { useState, useEffect } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { ProgressBar } from 'primereact/progressbar';
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { LayoutType, SortOrderType } from "../utils/types/types";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { Activity, EmployeeGrades } from "../utils/interfaces";
import axios from "axios";

const Activities = () => {
  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const activeActivities = activities.filter((act) => act.active === true);


  const [numberStepsByRole, setNumberStepsByRole] = useState<number>(0);
  const [value, setValue] = useState<number>(0);

  const [dataViewValue, setDataViewValue] = useState<Activity[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filteredValue, setFilteredValue] = useState<Activity[] | null>(null);
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
  const [testGrades, setTestGrades] = useState<EmployeeGrades[]>([]);

  const currentProgress = userSteps.filter(
    //@ts-ignore
    (entrada) => entrada.UserId === currentUser.id
  );

  const sortOptions = [
    { label: "Todos", value: "all", color: "#4F46E5" },
    { label: "Completados", value: "finished", color: "#69de92" },
    { label: "Empezados", value: "started", color: "#eec137" },
    { label: "Sin empezar", value: "notStarted", color: " #85b2f9" },
  ];

  useEffect(() => {
    setDataViewValue(activeActivities.sort((a, b) => a.orderId - b.orderId));
    setGlobalFilterValue("");
  }, [activities]);
  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    let sortedData = [...dataViewValue]; // Copiamos los datos originales
    const filters = {
      //@ts-ignore
      finished: (data: any) => {
        const activityId = data.id;
        return (
          //@ts-ignore
          finishedActivityInfo[activityId] && //@ts-ignore
          finishedActivityInfo[activityId].count > 0
        );
      },
      //@ts-ignore
      started: (data) => {
        const activityId = data.id;
        const notInFinishedInfo =
          !finishedActivityInfo.hasOwnProperty(activityId);
        const hasSteps = totalSteps.some(
          (step: any) => step.activityId === activityId
        );
        const isNotStarted =
          !activityIdsWithNoStepsFinished.includes(String(activityId)) && //@ts-ignore
          !finishedActivityInfo[activityId];

        return notInFinishedInfo && hasSteps && !isNotStarted;
      },
      notStarted: (data: any) => {
        const activityId = data.id;
        const notStarted =
          !activityIdsWithNoStepsFinished.includes(String(activityId)) && //@ts-ignore
          (!finishedActivityInfo[activityId] || //@ts-ignore
            finishedActivityInfo[activityId].count === 0);
        return notStarted;
      },
      //@ts-ignore
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

      if (value === "all") {
        return 0;
      }

      if (value === "started") {
        if (notStartedA && !isFinishedA) {
          return -1 * sortOrder;
        }
        if (notStartedB && !isFinishedB) {
          return 1 * sortOrder;
        }
      }

      if (value === "finished") {
        if (isFinishedA) {
          return -1 * sortOrder;
        }
        if (isFinishedB) {
          return 1 * sortOrder;
        }
      }

      return 0;
    });

    setSortKey(value);
    setFilteredValue(sortedData);
  };    
  
  const getProgressPercentage = (numberStepsByRole : number, numberStepsByUser : number) => {
    return  parseFloat(((numberStepsByUser / numberStepsByRole) * 100).toFixed(2))
  }

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(async () => {
          const response = await axios.get(`http://localhost:3001/tests/${currentUser.id}`);
          if (response) {
            setTestGrades(response.data);
          } else {
            console.error("No hay notas cargadas aún.");
          }
        }, 1000);
      } catch (error) {
        console.error("No hay notas cargadas aún.", error);
      }
    };
    if (currentUser.id !== 0) {
      fetchData();
    }
  }, [currentUser.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/roleSteps/${currentUser.id}`);
        setNumberStepsByRole(response.data)
      } catch (error) {
        console.error("Error al obtener la cantidad de pasos:", error);
      }
    };
    if(currentUser.id !== 0){
      fetchData();
    }
  }, [currentUser.id]);
  
  useEffect(() => {
    const progress = getProgressPercentage(numberStepsByRole, currentProgress.length);
    setValue(progress);
  }, [currentProgress]);

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
  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    setGlobalFilterValue(value);
    if (value.length === 0) {
        setFilteredValue(null);
    } else {
        const filtered = dataViewValue?.filter((activity) => {
            const productNameLowercase = activity.title.toLowerCase();
            const searchValueLowercase = value.toLowerCase();
            return productNameLowercase.includes(searchValueLowercase);
        });

        setFilteredValue(filtered);
    }
  };


  const dataViewHeader = (
    <div className="flex flex-column md:flex-row md:justify-content-between gap-2 rounded-lg">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "15px",
            height: "15px", //@ts-ignore
            backgroundColor: sortOptions.find(
              (option) => option.value === sortKey
            ).color,
            borderRadius: "50%",
            marginRight: "8px",
          }}
        ></div>
        <Dropdown
          value={sortKey}
          options={sortOptions}
          optionLabel="label"
          placeholder="Ordenar"
          onChange={onSortChange}
        />
      </div>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText 
          value={globalFilterValue} 
          onChange={onFilter}
          placeholder="Buscar"
          //onInput={(e) => setGlobalFilterValue(e.currentTarget.value)}
          //onChange={onFilter}
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

    //Filtro los pasos de la actividad actual y luego comparo con currentProgress para encontrar pasos terminados
    const stepsForActivity = //@ts-ignore
      totalSteps.filter((step) => step.activityId === filteredValue.id);

    const completedSteps = stepsForActivity.filter((step) => {
      const progress = //@ts-ignore
        currentProgress.find((progressStep) => progressStep.StepId === step.id);
      //@ts-ignore
      return progress && progress;
    });

    return (
      <div className={`col-12 border-none`}>
        <Link to={`/activity/${filteredValue.id}`}>
          <div
            className={`flex flex-column my-3 border rounded-lg shadow-sm p-4 ${
              isFinished ? "bg-green-200" : notStarted ? "bg-blue-200" : ""
            } hover:bg-slate-00 ${notStarted ? "text-red-500" : ""}`}
          >
            <div className="flex justify-between text-2xl font-bold">
              <section className=" flex gap-4">
                <div className="w-[48px] h-[48px] mt-[2px] rounded-full bg-[#6836cc] text-white relative flex items-center justify-center">
                  {filteredValue.orderId}   
                </div>
                <div className=" flex flex-col">
                  <h3 className="m-0 flex align-items-center">
                  {filteredValue.title}
                  {notStarted ? (
                    <i className="pi pi-exclamation-circle text-4xl ml-2 text-[#0b1522]"></i>
                  ) : isFinished ? ( // Agrega la verificación para mostrar "ACTIVIDAD FINALIZADA"
                    <i className="pi pi-check-circle text-4xl ml-2 text-[#0b1522]"></i>
                  ) : (
                    <i className="pi pi-lock-open text-4xl ml-2 text-[#0b1522]"></i>
                  )}
                  </h3>
                  <h6 className=" m-0">{completedSteps.length} / {filteredValue.numberSteps}</h6>
                </div>
              </section>
              <h4 className="m-0 flex align-items-center">
                {testGrades.length > 0 && (
                  <span>
                    {testGrades.map((grade) => {
                      if (grade.Activity.id === filteredValue.id) {
                        if (grade.gradeValue !== null && grade.maximunGradeValue !== null) {
                          return `Calificación: ${grade.gradeValue} / ${grade.maximunGradeValue}`;
                        } else {
                          return 'La calificación aún no está disponible.';
                        }
                      }
                      return null;
                    })}
                  </span>
                )}
              </h4>
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

    //Filtro los pasos de la actividad actual y luego comparo con currentProgress para encontrar pasos terminados
    const stepsForActivity = //@ts-ignore
      totalSteps.filter((step) => step.activityId === activityId);

    const completedSteps = stepsForActivity.filter((step) => {
      const progress = //@ts-ignore
        currentProgress.find((progressStep) => progressStep.StepId === step.id);
      //@ts-ignore
      return progress && progress;
    });

    return (
      <div className="col-12 lg:col-4">
        <Link to={`/activity/${data.id}`}>
          <div
            className={`card m-3 border-1 surface-border hover:bg-slate-100 ${
              isFinished ? "bg-green-200" : notStarted ? "bg-blue-200" : ""
            }`}
          >
            <div className="flex items-center justify-between text-center">
              <div className="text-2xl font-bold w-[90%]">
                <div className=" flex flex-col">
                <div className=" flex justify-start gap-2">
                  <div className=" flex[10%] w-[30px] h-[30px] mt-1 rounded-full bg-[#6836cc] text-white flex items-center justify-center">
                    {data.orderId}   
                  </div>
                    <h3 className=" flex-[90%] m-0 flex-row align-items-center">
                      {data.title}
                    </h3>
                </div>
                  <div className=" flex justify-start">
                    <h6 className=" m-0 pt-2" >{completedSteps.length} / {data.numberSteps}</h6>  
                  </div>
                </div>
                <h4 className="m-0 flex-row align-items-center">
                  {testGrades.length > 0 && (
                  <span>
                    {testGrades?.map((grade) => {
                      if (grade.Activity.id === data.id) {
                        return `Calificación: ${grade.gradeValue} / ${grade.maximunGradeValue}`;
                      }
                      return null;
                    })}
                  </span>
                  )}
                </h4>
              </div>
              <div className="pt-3">
                <h3>
                  {notStarted ? (
                    <i className="pi pi-exclamation-circle text-4xl ml-2 text-[#0b1522]"></i>
                  ) : isFinished ? ( // Agrega la verificación para mostrar "ACTIVIDAD FINALIZADA"
                    <i className="pi pi-check-circle text-4xl ml-2 text-[#0b1522]"></i>
                  ) : (
                    <i className="pi pi-lock-open text-4xl ml-2 text-[#0b1522]"></i>
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
                  userStep: any //@ts-ignore
                ) =>
                  stepsForActivity.some(
                    (step: any) => step.id === userStep.StepId
                  )
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
                (step: any) => step.title === stepNameToFind
              ) as { activityId: string } | undefined;

              const activityIdForStepName: string | null = stepWithActivityId
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
        <div className=" flex justify-between items-center">
          <h3>
            <i className="pi pi-book text-4xl mx-2" />
            Tus actividades:
          </h3>
          {
            value === 0 ?
            null:
            <div className=" w-[500px] pb-3">
              <ProgressBar value={value}></ProgressBar>
            </div>
          }
        </div>
          <DataView
            value={
              filteredValue || dataViewValue
              // filteredValue.length > 0
              //   ? filteredValue
              //   : sortKey === "all"
              //   ? dataViewValue
              //   : []
            }
            layout={layout}
            paginator
            emptyMessage="No se han encontrado actividades para su cargo."
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
