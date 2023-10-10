import React from "react";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import axios from "axios";
import * as XLSX from "xlsx";
import { Button } from "primereact/button";
import { excelRow } from "../utils/interfaces";
import { Dialog } from "primereact/dialog";


const Checkpoint = () => {
  const { id } = useParams();
  const activity = useSelector((state: RootState) => state.activities.activities);
  const currentActivity = activity.find((a) => a.id == id);
  const logUser = useSelector((state: RootState) => state.user.logUser);
  const [url] = useState<string | undefined>(currentActivity?.excelURL);

  const [visible, setVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState<boolean>(false);

  const isUnmounted = useRef(false);

  window.addEventListener('beforeunload', (event) => {
    const confirmationMessage = '¿Estás seguro de que deseas salir de esta página? Te recomendamos cerrar la pagina en la ventana de Home';
    event.returnValue = confirmationMessage;
    isUnmounted.current = true;
    handleExcelImport();
  });

  useEffect(() => {
    return () => {
      handleExcelImport();
    };
  }, []);

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
        console.log("Entro al return: Deberia hacer post Watched");
        
        isUnmounted.current = true;
        //Actualiza la propiedad testWatched
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
        // Realiza una solicitud GET para obtener el archivo Excel
        let response;
        if(url){
          response = await axios.get(url, { responseType: "arraybuffer" });
        }

        // Lee el archivo Excel y conviértelo en un objeto de datos
        const excelArrayBuffer = response?.data;
        const workbook = XLSX.read(new Uint8Array(excelArrayBuffer), {
          type: "array",
        });
        const sheetName = workbook.SheetNames[0]; // Suponiendo que solo hay una hoja en el archivo Excel

        // Convierte la hoja de Excel en un array de objetos JSON
        const excelArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Encuentra la última fila no vacía en excelArray
        let lastNonEmptyRow = null;
        for (let i = excelArray.length - 1; i >= 0; i--) {
          const row = excelArray[i] as excelRow;
          if (Object.keys(row).length > 3) {
            lastNonEmptyRow = row;
            break;
          }
        }

        if (lastNonEmptyRow) {
          let gradeValue;
          let maximunGradeValue;

          console.log(lastNonEmptyRow.B)

          if (typeof lastNonEmptyRow.B === "number") {
            gradeValue = 0;
            maximunGradeValue = 0;
          } else {
            const arrayValues = lastNonEmptyRow.B.split(" / ");
            [gradeValue, maximunGradeValue] = arrayValues;
          }

          //Verificar que el correo del empleado coincida con el guardado en el ingresado en el Test
          let objData;
          if(lastNonEmptyRow.D === logUser.email){
            objData = {
              gradeValue: gradeValue,
              maximunGradeValue: maximunGradeValue,
              activityId: id,
              userId: logUser.id,
            };
          } else {
            objData = {
              gradeValue: 0,
              maximunGradeValue: 0,
              activityId: id,
              userId: logUser.id,
            };
          }

          try {
            const response = await axios.put(
              "http://localhost:3001/test/update",
              objData
            );
            console.log(response.data);
          } catch (error: any) {
            console.log(error);
          }
        } else {
          let objData = {
            gradeValue: 0,
            maximunGradeValue: 0,
            activityId: id,
            userId: logUser.id,
          };
          try {
            const response = await axios.put(
              "http://localhost:3001/test/update",
              objData
            );
            console.log(response.data);
          } catch (error: any) {
            console.log(error);
          }
        }

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
        console.log(excelArray);
      }
    } catch (error) {
      console.error("Error al importar datos desde Excel:", error);
    }
  };

  return (
    <section className="flex flex-col justify-center  items-center py-3">
      <div className="w-full flex justify-between items-center my-2 px-2">
        <Button label="Recomendaciones" icon="pi pi-exclamation-triangle" onClick={() => setInfoVisible(true)} severity="danger" />
        <h3 className=" text-lg md:text-2xl m-0">
          Checkpoint de {currentActivity?.title}
        </h3>
        <Button label="Finalizar" icon="pi pi-external-link" onClick={() => setVisible(true)} />

        <Dialog
          header="Confirme su siguiente paso"
          visible={visible}
          onHide={() => setVisible(false)}
          style={{ width: "450px" }}
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
          className="w-[38vw]"
          modal
        >
          <div className="flex align-items-center justify-content-center">
            <i
              className="pi pi-exclamation-triangle mr-3 color-orange-500"
              style={{ fontSize: "2rem" }}
            />
            <ul className="m-0 gap-4 text-lg text-slate-950">
              <li className=" py-1">Ingrese el correo electrónico con el que está registrado/a en Edupluss.</li>
              <li  className=" py-1">No actualice la página mientras esté realizando la prueba.</li>
              <li className=" py-1">No cierre la página mientras esté realizando la prueba.</li>
              <li className=" py-1">Una vez haya termiando la prueba, puede regresar al Home mediante el boton "Finalizar"</li>
            </ul>
          </div>
        </Dialog>
      </div>
      <div className="flex w-full  py-3 items-center justify-center h-[80vh]">
        <iframe src={currentActivity?.formURL} className="w-full h-full">
          Cargando…
        </iframe>
      </div>
    </section>
  );
};

export default Checkpoint;
