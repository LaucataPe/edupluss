import React, { useState, useEffect } from "react";
import { Steps } from "primereact/steps";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CurrentStep from "../components/Step";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getStepsActivity } from "../redux/features/stepsSlider";
import { Button } from "primereact/button";
import { createUserStep } from "../redux/features/userStepsSlice";
import axios from "axios";

function Activity() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const steps = useSelector((state: RootState) => state.steps.steps);

  useEffect(() => {
    dispatch(getStepsActivity(Number(id)));
  }, [id]);

  const findActivityName = () => {
    const activityName = activities.find((act) => act.id === Number(id));
    return activityName?.title;
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentIndex = steps.findIndex((step) =>
      currentPath.endsWith(`/${step.number}`)
    );
    setActiveIndex(currentIndex === -1 ? currentIndex : 0);
  }, [steps]);

  const handleStepChange = (e: { index: number }) => {
    setActiveIndex(e.index);
  };

  const currentUser = useSelector((state: RootState) => state.user.logUser.id);
  const activityName = activities.find((act) => act.id === Number(id));
  const activityId = activityName?.id;

  const handleNextClick = async () => {
    const actualIndex = activeIndex === 0 ? 1 : activeIndex + 1;

    const userData = {
      userId: currentUser,
      stepId: actualIndex,
      activityId: activityId,
      finished: false,
    };
    try {
      // Realiza la petición POST usando axios
      const response = await axios.post(
        "http://localhost:3001/userStep",
        userData
      );

      // Aquí puedes manejar la respuesta si es necesario
      console.log("Respuesta de la petición POST:", response.data);
    } catch (error) {
      // Maneja los errores de la petición
      console.warn("Error al hacer la petición POST:", error);
    }
    setActiveIndex(activeIndex + 1);
  };

  const handleFinishClick = async () => {
    const userData = {
      userId: currentUser,
      StepId: steps.length,
      activityId: activityId,
      finished: true,
    };

    try {
      // Realiza la petición POST usando axios
      const response = await axios.post(
        "http://localhost:3001/userStep",
        userData
      );
      console.log("Respuesta de la petición POST:", response.data);
    } catch (error) {
      console.warn("Error al hacer la petición POST:", error);
    }
  };

  return (
    <>
      <Link to={`/home`}>
        <Button
          icon="pi pi-angle-double-left"
          label="Atrás"
          className="m-2 absolute"
          rounded
          severity="secondary"
        />
      </Link>
      <h1 className="my-4 text-center text-4xl font-semibold">
        {findActivityName()}
      </h1>
      <div className="grid p-fluid mx-5">
        <div className="col-12">
          <div className="card w-[100%] relative">
            <Steps
              model={steps.map((step) => ({
                label: `Paso ${step.number}`,
                command: () => {},
              }))}
              activeIndex={activeIndex}
              onSelect={handleStepChange}
              readOnly={false}
            />
            {steps && <CurrentStep step={steps[activeIndex]} />}

            {activeIndex > 0 && (
              <Button
                label="Anterior"
                icon="pi pi-arrow-left"
                severity="warning"
                outlined
                onClick={() => setActiveIndex(activeIndex - 1)}
                className="absolute w-auto bottom-4 left-4"
              />
            )}
            {activeIndex < steps.length - 1 ? (
              <Button
                label="Siguiente"
                icon="pi pi-arrow-right"
                severity="success"
                outlined
                onClick={handleNextClick}
                className="absolute w-auto bottom-4 right-4"
              />
            ) : (
              <>
                <Link to="/home">
                  <Button
                    label="Finalizar"
                    icon="pi pi-home"
                    severity="info"
                    outlined
                    onClick={handleFinishClick}
                    className="absolute w-auto bottom-4 right-4"
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Activity;
