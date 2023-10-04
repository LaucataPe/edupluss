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
  // Crear un arreglo para almacenar los activityId de los pasos finalizados
  const finishedActivityIds = [];

  // Filtrar los pasos finalizados
  const finishedSteps = currentProgress.filter((step) => step.finished);

  // Obtener los activityId de los pasos finalizados
  finishedSteps.forEach((step) => {
    const { StepId } = step;

    // Encontrar el step correspondiente en totalSteps
    const matchingStep = totalSteps.find((ts) => ts.id === StepId);

    if (matchingStep) {
      const { activityId } = matchingStep;
      finishedActivityIds.push(activityId);
    }
  });

  // Mostrar los activityId en la consola
  console.log("ActivityIds de los pasos finalizados:", finishedActivityIds);

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
    return (
      <div className="col-12 border-none">
        <Link to={`/activity/${data.id}`}>
          <div className="flex flex-column my-3 border rounded-lg shadow-sm p-4 hover:bg-slate-100">
            <div className="text-2xl font-bold">
              <h3 className="m-0">{data.title}</h3>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const dataviewGridItem = (data: Activity) => {
    return (
      <div className="col-12 lg:col-4">
        <Link to={`/activity/${data.id}`}>
          <div className="card m-3 border-1 surface-border hover:bg-slate-100">
            <div className="flex flex-column align-items-center text-center">
              <div>
                <h3 className="m-0">{data.title}</h3>
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
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                className="col-12 w-auto flex-wrap"
                id={`activities-list-${index}`}
                key={index}
              >
                <div className="card m-3 border-1 surface-border hover:bg-slate-100">
                  <h3 className="m-0">Clase de Excel {index}</h3>
                </div>
              </div>
            ))}
        </div>
        <div
          className="card flex mx-[5%]"
          id="pending-activities"
          style={{ overflowX: "auto" }}
        >
          <h3 className="flex align-items-center gap-2">
            <i className="pi pi-check-square text-4xl gap-2" />
            Listos:
          </h3>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                className="col-12 w-auto flex-wrap"
                id={`activities-list-${index}`}
                key={index}
              >
                <div className="card m-3 border-1 surface-border hover:bg-slate-100">
                  <h3 className="m-0">Clases de Calculo {index}</h3>
                </div>
              </div>
            ))}
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
