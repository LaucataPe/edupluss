import { Activity } from "../utils/interfaces";
import React, { useState, useEffect } from "react";
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
  // console.log("Estos son los steps:", steps);
  // console.log("Este es el newUserSteps:", newUserSteps);
  const userIdToFind = selectedUser;
  const matchingStepIds = newUserSteps
    .filter((item: any) => item.UserId === userIdToFind)
    .map((item: any) => item.StepId);

  // console.log("matchingStepIds del usuario", matchingStepIds);

  const matchingStepTitles = matchingStepIds.map((stepId: any) => {
    const matchingStep = Object.values(steps).find(
      //@ts-ignore
      (step) => step.id === stepId
    ); //@ts-ignore
    return matchingStep?.title;
  });
  console.log(matchingStepTitles);

  return (
    <>
      <header className="bg-1 p-2 max-w-md rounded-t-md lg:max-w-lg flex justify-between">
        <h3 className="mb-0 text-white text-base flex justify-center items-center p-2">
          Progreso de actividad
        </h3>

        <div className="max-h-[40px] flex items-center cursor-pointer">
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            onClick={closeModal}
          >
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
        {activities.map((activity: Activity, index: number) => {
          const stepTitle = matchingStepTitles[index];
          const progressValue = matchingStepTitles.includes(stepTitle)
            ? 100
            : 0;
          let showSinSteps = true; // Variable para controlar si mostrar "Sin Steps"

          return (
            <>
              {stepTitle ? (
                <div
                  key={activity.id}
                  className={`py-2 px-6 flex items-center justify-between gap-4 `}
                >
                  <span className="max-w-[500px] text-lg font-semibold text-black">
                    {stepTitle ? stepTitle : ""}
                  </span>
                  <progress
                    className="w-100 h-4 border-2 border-gray-400 rounded-md"
                    max="100"
                    value={progressValue}
                  />
                </div>
              ) : showSinSteps ? (
                <div key={index}></div>
              ) : null}
              {stepTitle && showSinSteps && (showSinSteps = false)}
            </>
          );
        })}
      </div>
    </>
  );
}

export default ProgressModal;
