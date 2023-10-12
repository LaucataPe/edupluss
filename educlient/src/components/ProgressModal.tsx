//@ts-nocheck
import { Activity } from "../utils/interfaces";
import React, { useState, useEffect } from "react";
import { CheckboxChangeEvent } from "primereact/checkbox";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
import ChartDataLabels from "chartjs-plugin-datalabels";

function ProgressModal({
  activities,
  closeModal,
  userSteps,
  selectedUser,
}: {
  activities: Activity[];
  closeModal: () => void;
  userSteps: any;
  selectedUser: number;
}) {
  const [newUserSteps] = useState(userSteps);
  const [steps, setSteps] = useState([]);
  const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    let selectedValue = [...checkboxValue];
    if (e.checked) selectedValue.push(e.value);
    else selectedValue.splice(selectedValue.indexOf(e.value), 1);

    setCheckboxValue(selectedValue);
  };

  const itemsPerPage = 5;

  const handleBackButtonClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextButtonClick = () => {
    const totalPages = Math.ceil(matchingStepTitles.length / itemsPerPage);
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/steps");
        const stepsData = response.data;
        setSteps(stepsData);
      } catch (error) {
        console.error("Error al obtener datos de UserSteps:", error);
      }
    };
    fetchData();
  }, []);

  const userIdToFind = selectedUser;
  const matchingStepIds = newUserSteps
    .filter((item: any) => item.UserId === userIdToFind)
    .map((item: any) => item.StepId);

  const matchingStepTitles = matchingStepIds.map((stepId: any) => {
    const matchingStep = Object.values(steps).find(
      //@ts-ignore
      (step) => step.id === stepId
    ); //@ts-ignore
    return matchingStep?.title;
  });

  const matchingStepActivities = matchingStepTitles.map((stepTitle: any) => {
    //@ts-ignore
    const step = steps.find((step) => step.title === stepTitle);
    if (step) {
      const activity = activities.find(
        //@ts-ignore

        (activity) => activity.id === step.activityId
      );
      return activity ? activity.title : null;
    }
    return null;
  });

  // Calcula el índice de inicio y final para los elementos en la página actual.
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Crear pares de títulos de pasos y nombres de actividades
  const stepTitleActivityPairs = matchingStepTitles.map(
    (stepTitle: any, index: number) => ({
      stepTitle,
      activityName: matchingStepActivities[index],
    })
  );
  const ActivityProgress = [];

  // Crear un objeto para realizar el seguimiento del recuento de stepTitles
  const activityCounts = {};
  // Iterar sobre stepTitleActivityPairs
  stepTitleActivityPairs.forEach((pair) => {
    const { stepTitle, activityName } = pair;

    // Verificar si ya hemos registrado esta actividad
    if (!activityCounts[activityName]) {
      activityCounts[activityName] = 0;
    }

    // Incrementar el recuento de stepTitles para esta actividad
    activityCounts[activityName]++;

    // Verificar si ya hemos registrado esta actividad en ActivityProgress
    const existingActivity = ActivityProgress.find(
      (activity) => activity.activityName === activityName
    );

    // Si no existe, agregarla a ActivityProgress
    if (!existingActivity) {
      ActivityProgress.push({ activityName, totalStepTitles: 0 });
    }
  });

  // Actualizar el valor total de stepTitles en ActivityProgress
  ActivityProgress.forEach((activity) => {
    activity.totalStepTitles = activityCounts[activity.activityName];
  });

  // Renderizado de elementos
  const renderedItems = ActivityProgress.map((activity, index) => {
    const { activityName, totalStepTitles } = activity;

    // Busca la actividad correspondiente en el array activities
    const matchingActivity = activities.find(
      (activity) => activity.title === activityName
    );

    // Obtiene el numero de pasos si se encuentra
    const currentMaxSteps = matchingActivity ? matchingActivity.numberSteps : 0;

    const activityProgress = Math.floor(
      (totalStepTitles * 100) / currentMaxSteps
    );

    const data = {
      labels: ["Progreso", "Restante"],
      datasets: [
        {
          data: [activityProgress, 100 - activityProgress], // Cambia el valor 41 al valor de progreso que desees
          backgroundColor: ["rgb(99, 195, 255)", "rgba(200, 200, 200, 0.500)"],
          borderColor: ["#639aff", "#c8c8c8"],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        datalabels: {
          display: false,
          color: "black",
          formatter: (value, context) => {
            const label = context.chart.data.labels[context.dataIndex];
            if (label === "Progreso") {
              return value + "%";
            }
            return "";
          },
          text: {
            align: "center",
            anchor: "center",
          },
        },
      },
    };
    return (
      <div
        key={index}
        className={`px-4 flex items-center justify-center gap-1`}
      >
        <label
          htmlFor={`checkOption${index}`}
          className="flex align-items-center justify-content-between col-12 border-2 shadow-sm p-2 my-2 rounded-2xl gap-4"
        >
          <strong className="text-xl">{activityName}</strong>
          <div
            style={{
              width: "100px",
              position: "relative",
            }}
          >
            <Doughnut options={options} data={data} />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%", // Cambia "35%" a "50%" para centrar horizontalmente
                transform: "translate(-50%, -50%)",
              }}
            >
              {activityProgress}%
            </div>
          </div>
        </label>
      </div>
    );
  });

  return (
    <>
      <header className="bg-1 p-2 max-w-md rounded-t-md lg:max-w-lg flex justify-between">
        <h3 className="mb-0 text-white text-base flex justify-center items-center p-2">
          Progreso de actividad
        </h3>
        <div
          className="max-h-[40px] flex items-center cursor-pointer"
          onClick={closeModal}
        >
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
              fill="#fff"
            ></path>
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier"></g>
          </svg>
        </div>
      </header>
      <div className="rounded-b-md max-w-xl px-4 py-6 border-x-2 border-b-2 lg:max-w-lg">
        {matchingStepTitles.length === 0 ? (
          <div className="flex justify-between mt-4 p-10 text-2xl">
            No se ha realizado ningun paso, ni empezado una actividad.
          </div>
        ) : (
          renderedItems
        )}
        {matchingStepTitles.length > itemsPerPage && (
          <div className="flex justify-between mt-2 mb-1">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={handleBackButtonClick}
            >
              Atrás
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={handleNextButtonClick}
            >
              Adelante
            </button>
          </div>
        )}
        <span className="ml-1">Página {currentPage + 1}</span>
      </div>
    </>
  );
}

export default ProgressModal;
