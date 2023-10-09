import { Activity } from "../utils/interfaces";
import React, { useState, useEffect } from "react";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Tag } from "primereact/tag";
import axios from "axios";

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

  // Renderizado de elementos
  const renderedItems = stepTitleActivityPairs
    .slice(startIndex, endIndex) //@ts-ignore

    .map(({ stepTitle, activityName }, index: number) => {
      const progressValue = matchingStepTitles.includes(stepTitle) ? 1 : 0;

      return (
        <div
          key={index}
          className={` px-4 flex items-center justify-center gap-1 `}
        >
          {stepTitle ? (
            <>
              <label
                htmlFor={`checkOption${index}`}
                className="col-6 border-2 shadow-sm p-2 my-2 rounded-2xl "
              >
                <strong className="text-xl">{activityName}</strong>
              </label>
              <label
                htmlFor={`checkOption${index}`}
                className="col-6 text-center "
              >
                {stepTitle}
              </label>
              <div className="field-checkbox text-center mb-0">
                <Checkbox
                  inputId={`checkOption${index}`}
                  name="option"
                  checked={progressValue !== 0}
                  onChange={onCheckboxChange}
                />
              </div>
            </>
          ) : (
            <div>Aún no realizó ningún paso</div>
          )}
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
      <div className="rounded-b-md max-w-md px-4 py-6 border-x-2 border-b-2 lg:max-w-lg">
        <Tag severity="info" className="text-sm ml-2" rounded>
          Página {currentPage + 1}
        </Tag>
        {matchingStepTitles.length === 0 ? (
          <div>No se han realizado ningún paso</div>
        ) : (
          renderedItems
        )}
        {matchingStepTitles.length > itemsPerPage && (
          <div className="flex justify-between mt-4">
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
      </div>
    </>
  );
}

export default ProgressModal;
