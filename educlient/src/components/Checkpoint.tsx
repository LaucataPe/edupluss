import React from "react";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate} from "react-router-dom";
import { RootState } from "../redux/store";
import axios from "axios";
import * as XLSX from "xlsx";
import { Button } from "primereact/button";
import { excelRow } from "../utils/interfaces";
import { Dialog } from "primereact/dialog";
import { Message } from 'primereact/message';
import { Toast } from "primereact/toast";

function formatTime(ms : number) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const Checkpoint = () => {
  const { id } = useParams();
  let idAux : number;
  if(id){
    idAux = parseInt(id);
  }
  const activity = useSelector((state: RootState) => state.activities.activities);
  const currentActivity = activity.find((a) => a.id == id);
  const logUser = useSelector((state: RootState) => state.user.logUser);
  const [url] = useState<string | undefined>(currentActivity?.excelURL);
  const [visible, setVisible] = useState<boolean>(false);
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const isUnmounted = useRef(false);

  window.addEventListener('beforeunload', (event) => {
    const confirmationMessage = '¿Estás seguro de que deseas salir de esta página? Te recomendamos cerrar la pagina en la ventana Home';
    event.returnValue = confirmationMessage;
    isUnmounted.current = true;
    if(logUser.id !== 0) {
      handleExcelImport();
    }
  });

  useEffect(() => {
    return () => {
      if(logUser.id !== 0){
        handleExcelImport();
      }
    };
  }, [logUser.id]);

  useEffect(() => {
    if (currentActivity?.durationTest) {
      // Convierte el valor en formato "hh:mm:ss" a milisegundos
      const [hours, minutes, seconds] = currentActivity.durationTest.split(':');
      const durationInMilliseconds = (parseInt(hours) * 3600000) + (parseInt(minutes) * 60000) + (parseInt(seconds) * 1000);
      setDuration(durationInMilliseconds);
    }
  }, [currentActivity?.durationTest]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    let interval: NodeJS.Timeout | undefined;

    if (duration > 0) {
      // Mostrar toast 15 segundos antes
      const timeBeforeToast = duration - 15000; 

      timer = setTimeout(() => {
        toast.current?.show({
          severity: "error",
          summary: "El tiempo de la prueba está por finalizar.",
          detail: "Será redirigido/a al Home",
          life: 15000,
          style: { marginTop: '80px' },
        });
      }, timeBeforeToast);

      let timeRemaining = duration;

      interval = setInterval(() => {
        if (timeRemaining >= 1000) {
          setTimeLeft(timeRemaining);
          timeRemaining -= 1000;
        } else {
          clearInterval(interval);

          setTimeout(() => {
            navigate('/home');
          }, 0); 
        }
      }, 1000);

      return () => {
        if (timer) clearTimeout(timer);
        if (interval) clearInterval(interval);
      };
    }
  }, [duration, navigate]);

  const confirmationDialogFooter = (
    <>
      <Button
        type="button"
        label="Cancelar"
        severity="danger"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        text
        />
      <Link to="/home">
        <Button
          type="button"
          severity="success"
          label="Continuar"
          icon="pi pi-check"
          text
          autoFocus
        />
      </Link>
    </>
  );

  const handleExcelImport = async () => {
    try {
      if (isUnmounted.current === false) {
        isUnmounted.current = true;
        let obj = {
          activityId: id,
          userId: logUser.id,
          testWatched: true
        }
        try {
          const response = await axios.post(
            "http://localhost:3001/test",
            obj
          );
          console.log(response.data);
        } catch (error: any) {
          console.log(error);
        }
        return;
      } else {
        let response;
        if(url){
          response = await axios.get(url, { responseType: "arraybuffer" });
        }

        // Lee el archivo Excel y lo convierte en un objeto de datos JSON
        const excelArrayBuffer = response?.data;
        const workbook = XLSX.read(new Uint8Array(excelArrayBuffer), {
          type: "array",
        });
        const sheetName = workbook.SheetNames[0]; 
        const excelArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Encuentra la última fila no vacía en excelArray (Nombres de las columnas del excel)
        let lastNonEmptyRow = null;
        for (let i = excelArray.length - 1; i >= 0; i--) {
          const row = excelArray[i] as excelRow;
          if (Object.keys(row).length > 3) {
            lastNonEmptyRow = row;
            break;
          }
        }

        if (lastNonEmptyRow) {
          const headerRow : excelRow = excelArray[0] as excelRow;
          const punctuationColumn = Object.keys(headerRow).find((key) =>
            headerRow[key].toString().toLowerCase() === "puntuación"
          );
          const emailColumn = Object.keys(headerRow).find((key) =>
            headerRow[key].toString().toLowerCase() === "correo electrónico"
          );
          let gradeValue;
          let maximunGradeValue;
          let punctuation;
          let email;
          let errorTest = false;

          if (punctuationColumn && emailColumn) {
            punctuation = lastNonEmptyRow[punctuationColumn];
            email = lastNonEmptyRow[emailColumn];
            //console.log("Puntuación:", punctuation);
            //console.log("Correo Electrónico:", email);

            if (typeof punctuation === "number") {
              //!Error (JS lee la puntuacion como una operacion matematica)
              gradeValue = 0;
              maximunGradeValue = 0;
              errorTest = true;
            } else {
              const arrayValues = punctuation.split(" / ");
              [gradeValue, maximunGradeValue] = arrayValues;
            }

            //Verificar que el correo del empleado coincida con el guardado en el excel del Test
            let objData;
            if(email === logUser.email){
              let gradeValueAux;
              let maximunGradeValueAux;
              if (typeof gradeValue === "string" && typeof maximunGradeValue === "string") {
                gradeValueAux = parseInt(gradeValue); 
                maximunGradeValueAux = parseInt(maximunGradeValue); 
                objData = {
                  gradeValue: gradeValueAux,
                  maximunGradeValue: maximunGradeValueAux,
                  activityId: idAux,
                  userId: logUser.id,
                  errorTest: errorTest
                };
              }
            } else {
              //!Error (No se encontró el email del empleado en la ultima fila del excel)
              objData = {
                gradeValue: 0,
                maximunGradeValue: 0,
                activityId: idAux,
                userId: logUser.id,
                errorTest: true
              };
            }
            //console.log(objData);
            
            try {
              await axios.patch(
                "http://localhost:3001/test/update",
                objData
              );
              //console.log(response.data);
            } catch (error: any) {
              console.log(error);
            }
            } else {
              //!Error (No se encontraron las columnas "Puntuación" y "Correo electrónico" como parte del cuestionario)
              let objData = {
                gradeValue: 0,
                maximunGradeValue: 0,
                activityId: idAux,
                userId: logUser.id,
                errorTest: true
              };
              //console.log(objData);
              try {
                await axios.patch(
                  "http://localhost:3001/test/update",
                  objData
                );
                //console.log(response.data);
              } catch (error: any) {
                console.log(error);
              }
            }
            //Modifica el array sin incluir los objetos (rows) vacios
            for (let key in excelArray) {
              const row = excelArray[key] as excelRow;
              if (
                Object.keys(row).length < 2 &&
                row.hasOwnProperty("__EMPTY") &&
                row.hasOwnProperty("__rowNum__")
              ) {
                delete excelArray[key];
              }
            }
            //console.log(excelArray);
            
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error.",
              detail: "No se encontraron las columnas 'Puntuación' y 'Correo Electrónico'.",
              style: { marginTop: '80px' },
              life: 3000,
            });
          } 
      }
    } catch (error) {
      console.error("Error al importar datos desde Excel:", error);
    }
  };

  return (
    <>
    <Toast ref={toast} />
  
    <section className="flex flex-col justify-center  items-center py-3 ml-3 sm:ml-0">
      <h3 className=" text-2xl  m-0 text-center mb-2 sm:hidden ">
        Prueba de: {currentActivity?.title}
      </h3>
      <div className="w-full flex justify-between items-center my-2 px-2">
        <Button label="Recomendaciones" icon="pi pi-exclamation-triangle " className=" h-[40px] text-xs sm:h-[50px] sm:text-base" onClick={() => setInfoVisible(true)} severity="danger" />
        <h3 className=" hidden sm:block text-xl md:text-2xl lg:text-4xl m-0">
          Prueba de: {currentActivity?.title}
        </h3>
        <Button label="Finalizar" className=" h-[40px] text-xs sm:h-[50px] sm:text-base" icon="pi pi-external-link" onClick={() => setVisible(true)} />

        <Dialog
          header="Confirme su siguiente paso"
          visible={visible}
          onHide={() => setVisible(false)}  
          className="p-fluid w-[340px] sm:w-[450px]"
          modal
          footer={confirmationDialogFooter}
        >
          <div className="flex align-items-center justify-content-center">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>¿Estás seguro de salir? Tenga en cuenta que no podra regresar a esta ventana.</span>
          </div>
        </Dialog>

        <Dialog
          header="Recomendaciones al empleado"
          visible={infoVisible}
          onHide={() => setInfoVisible(false)}
          className="p-fluid w-[340px] sm:w-[450px] lg:w-[550px]"
          modal
        >
          <div className="flex align-items-center justify-content-center">
            <i
              className="pi pi-exclamation-triangle mr-3 color-orange-500 hidden sm:block"
              style={{ fontSize: "2rem" }}
            />
            <ul className="m-0 gap-4 text-lg text-slate-950">
              <li className=" py-1">Ingrese el correo electrónico con el que está registrado/a en Edupluss.
                <b>{logUser ? ` ${logUser.email}` : " Si no lo recuerda, consulte con su encargado."}</b>
              </li>
              <li className=" py-1">No actualice ni cierre la página mientras esté realizando la prueba.</li>
              <li className=" py-1">Una vez haya termiando la prueba, puede regresar al Home mediante el boton "Finalizar"</li>
            </ul>
          </div>
        </Dialog>
      </div>
      <div className="flex w-full  py-3 items-center justify-center h-[75.2vh]">
        <iframe src={currentActivity?.formURL} className="w-full h-full">
          Cargando…
        </iframe>
      </div> 
      {
        duration > 0 ?
        <Message  severity="warn" text={`Tiempo restante: ${formatTime(timeLeft )}`}  className="mt-1"/>
        :
        null
      }
    </section>
    </>
  );
};

export default Checkpoint;
