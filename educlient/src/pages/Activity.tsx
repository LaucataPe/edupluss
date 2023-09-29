import React, { useState, useEffect } from "react";
import { Steps } from "primereact/steps";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CurrentStep from "../components/Step";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getStepsActivity } from "../redux/features/stepsSlider";
import { Button } from "primereact/button";

function Activity() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [activeIndex, setActiveIndex] = useState<number>(0);

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
    setActiveIndex(currentIndex !== -1 ? currentIndex : 0);
  }, [steps]);

  const handleStepChange = (e: { index: number }) => {
    setActiveIndex(e.index);
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
                onClick={() => setActiveIndex(activeIndex + 1)}
                className="absolute w-auto bottom-4 right-4"
              />
            ) : (
              <>
              <Review></Review>
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
