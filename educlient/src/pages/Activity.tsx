import React, { useState, useEffect } from "react";
import { Steps } from "primereact/steps";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CurrentStep from "../components/Step";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getStepsActivity } from "../redux/features/stepsSlider";
import { Button } from "primereact/button";
import { createUserStep } from "../redux/features/userStepsSlice"; // Asegúrate de proporcionar la ruta correcta

function Activity() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const stepSaved = window.localStorage.getItem(`Activity ${id}`);
    if (stepSaved !== null) {
      const value = JSON.parse(stepSaved);
      value >= 0 ? setCurrentStep(value) : null;
    } else {
      window.localStorage.setItem(`Activity ${id}`, JSON.stringify(0));
    }
  }, []);

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
  const currentUser = useSelector((state: RootState) => state.user.logUser.id);
  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentIndex = steps.findIndex((step) =>
      currentPath.endsWith(`/${step.number}`)
    );
    setActiveIndex(
      currentIndex === -1 ? currentIndex : currentIndex >= 0 ? currentStep : 0
    );
  }, [steps]);

  const handleStepChange = (e: { index: number }) => {
    setActiveIndex(e.index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const percentage = (activeIndex / (steps.length - 1)) * 100;
      console.log(
        "Todos los steps",
        steps.length,
        "Step actual",
        activeIndex,
        "Porcentaje de progreso",
        percentage.toFixed(2) + "%",
        steps.length - 1 === activeIndex ? true : false
      );
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [activeIndex, steps]);
  const handleNextClick = () => {
    // Datos que deseas enviar al servidor al hacer clic en "Siguiente"
    const userData = {
      finished: false,
      UserId: currentUser,
      StepId: activeIndex, // Utiliza el índice actual como StepId
    };

    // Realiza el dispatch para crear el paso de usuario
    dispatch(createUserStep(userData));

    // Cambia el índice activo al siguiente paso
    setActiveIndex(activeIndex + 1);
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
            {steps && id && (
              <CurrentStep
                step={steps[activeIndex]}
                activityId={id}
                activeIndex={activeIndex}
              />
            )}

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
