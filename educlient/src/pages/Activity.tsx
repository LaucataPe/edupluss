import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Steps } from "primereact/steps";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CurrentStep from "../components/Step";
import { useAppDispatch } from "../hooks/typedSelectors";
import { getStepsActivity } from "../redux/features/stepsSlider";
import { Button } from "primereact/button";
import RateActivity from "../components/RateActivity";
import { TestGrade } from "../utils/interfaces";
import axios from "axios";


function Activity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dialog, setDialog] = useState<boolean>(false);
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [contiune, setContiune] = useState<boolean>(false);
  

  const logUser = useSelector((state: RootState) => state.user.logUser);
  
  const [userReview, setUserReview] = useState<boolean>(false);
  const [testGrade, setTestGrade] = useState<TestGrade>({});

  useEffect(() => {
    const getTestGrade = async () => {
      try {
        const response = await axios(`http://localhost:3001/test?userId=${logUser.id}&activityId=${id}`);

        if (response.data) {
          setTestGrade(response.data);
        } else {
          console.error("El empleado no ha realizado el test de esta actividad.");
        }
      } catch (error) {
        console.error("Error al obtener datos de TestGrade:", error);
      }
    };
    getTestGrade();
}, []);

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

  let durationTest: undefined | string;
  const activity = activities.find((act) => act.id === Number(id));
  durationTest = activity?.durationTest;
  

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

  const currentUser = useSelector((state: RootState) => state.user.logUser.id);
  const activityName = activities.find((act) => act.id === Number(id));
  const activityId = activityName?.id;
  const stepsList = steps.map((step) => step.id);
  //console.log("soy activityId",activityId);

  const handleNextClick = async () => {
    if (activeIndex < stepsList.length - 1) {
      const actualIndex = stepsList[activeIndex];
      const userData = {
        userId: currentUser,
        stepId: actualIndex,
        activityId: activityId,
        finished: "false",
      };
      try {
        // @ts-ignore
        const response = await axios.post(
          "http://localhost:3001/userStep",
          userData
        );

        // Aquí puedes manejar la respuesta si es necesario
      } catch (error: any) {
        if (error.response && error.response.status === 409) {
          console.log("Este paso ya fue visitado");
        } else {
          console.warn("Error al hacer la petición POST:", error);
        }
      }
      setActiveIndex(activeIndex + 1);
    } else {
      console.log("No more steps to process.");
    }
  };

  const handleFinishClick = async () => {
    const userData = {
      userId: currentUser,
      stepId: stepsList[stepsList.length - 1],
      activityId: activityId,
      finished: "true",
    };

    try {
      // @ts-ignore
      const response = await axios.post(
        "http://localhost:3001/userStep",
        userData
      );
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        console.log("Este paso ya fue visitado y Completado.");
      } else {
        console.warn("Error al hacer la petición POST:", error);
      }
    }

    const hasTest = activities.find((a) => a.id == id);
    hasTest?.hasTest ? navigate(`/checkpoint/${id}`) : navigate("/home");
  };

  const confirmationDialogFooter = (
    <>
      <Button
        type="button"
        label="Cancelar"
        severity="danger"
        icon="pi pi-times"
        onClick={() => setInfoVisible(false)}
        text
        />
      <Link to="/home">
        <Button
          type="button"
          severity="success"
          label="Empezar"
          onClick={handleFinishClick}
          icon="pi pi-check"
          text
          autoFocus
        />
      </Link>
    </>
  );

  const showDialog = () => {
    setDialog(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`http://localhost:3001/review?userId=${logUser.id}&activityId=${id}`);

        if (response.data) {
          setUserReview(response.data);
        } else {
          console.error("La review no ha sido creada todavía");
        }
      } catch (error) {
        console.error("Error al obtener datos del Review:", error);
      }
    };
    fetchData();
}, [showDialog]);

  const hideDialog = () => {
    setDialog(false);
    setContiune(false);
  };

  const checkHasTest = () => {
    // let idNumber = Number(id)
    const hasTest = activities.find((a) => a.id == id);

    hasTest?.hasTest ? setContiune(true) : handleFinishClick();
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
              readOnly={true}
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
                {/* <Link to="/home"> */}
                <Button
                  label="Finalizar"
                  icon="pi pi-home"
                  severity="info"
                  outlined
                  onClick={showDialog}
                  disabled={testGrade.testWatched ? true : false}
                  className="absolute w-auto bottom-4 right-4"
                />
                {/* </Link> */}
              </>
            )}
          </div>
        </div>
      </div>
      <Dialog
        visible={dialog}
        style={{ width: "650px" }}
        header="Confirme su siguiente paso"
        modal
        onHide={hideDialog}
      >
        <div className="flex flex-col items-center justify-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {
            userReview === false && (
            <div onClick={checkHasTest}>
              <RateActivity activityId={activityId} currentUser={currentUser}/>
            </div>
            )
          }
          {userReview || contiune ?
            <div className=" pt-4 text-center text-lg text-slate-950">
              <p>
                Si continuas serás redireccionado/a al test de la actividad.
              </p>
              <span>¿Estás seguro/a de que continuar?</span>
              <div className="flex justify-end w-full pt-4">
                <Button
                  label="No"
                  icon="pi pi-times"
                  text
                  onClick={hideDialog}
                />
                <Button
                  label="Sí"
                  icon="pi pi-check"
                  text
                  onClick={() => setInfoVisible(true)}
                />
              </div>
            </div>
            :
            null
          }
        </div>
      </Dialog>

      <Dialog
          header="Recomendaciones al empleado"
          visible={infoVisible}
          onHide={() => setInfoVisible(false)}
          className="w-[38vw]"
          modal
          footer={confirmationDialogFooter}
        >
          <div className="flex align-items-center justify-content-center">
            <ul className="m-0 gap-4 text-lg text-slate-950">
              <li className=" py-1">Antes de iniciar la prueba tome en cuenta lo siguiente:</li>
              <li className=" py-1">Ingrese el correo electrónico con el que está registrado/a en Edupluss:
                <b>{logUser ? ` ${logUser.email}` : " Si no lo recuerda, consulte con su encargado."}</b>
              </li>
              <li  className=" py-1">No actualice ni cierre la página mientras esté realizando la prueba.</li>
              {
                durationTest ?
                <ul className="m-0 gap-4 text-lg text-slate-950">
                  <li className=" py-1">El test contará con la siguiente duración: {durationTest}</li>
                  <li className=" py-1">Intente enviar el cuestionario antes del tiempo especificado.</li>
                </ul>
                :
                null
              }
              <li className=" py-1">Una vez haya termiando la prueba, puede regresar al Home mediante el boton "Finalizar"</li>
            </ul>
          </div>
        </Dialog>
    </>
  );
}

export default Activity;
