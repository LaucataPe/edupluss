import React from "react";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import axios from "axios";
import * as XLSX from "xlsx";
import { Button } from "primereact/button";
import { excelRow } from "../utils/interfaces";


const Checkpoint = () => {
  const { id } = useParams();
  const activity = useSelector(
    (state: RootState) => state.activities.activities
  );
  const currentActivity = activity.find((a) => a.id == id);
  const logUser = useSelector((state: RootState) => state.user.logUser);
  const [url] = useState<string | undefined>(currentActivity?.excelURL);

  const isUnmounted = useRef(false);

  useEffect(() => {
    return () => {
      handleExcelImport();
    };
  }, []);

  const handleExcelImport = async () => {
    try {
      if (isUnmounted.current === false) {
        isUnmounted.current = true;
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

          let obj = {
            gradeValue: gradeValue,
            maximunGradeValue: maximunGradeValue,
            activityId: id,
            userId: logUser.id,
          };

          try {
            const response = await axios.post(
              "http://localhost:3001/test",
              obj
            );
            console.log(response.data);
          } catch (error: any) {
            console.log(error);
          }
        } else {
          console.log("No se encontraron filas de datos en el archivo Excel.");
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
        <h3 className=" text-lg md:text-2xl mb-0">
          Checkpoint de {currentActivity?.title}
        </h3>
        <Link to="/home">
          <Button label="Finalizar" />
        </Link>
      </div>

      <div className=" w-full h-screen">
        <iframe src={currentActivity?.formURL} className="w-full h-full">
          Cargando…
        </iframe>
      </div>
    </section>
  );
};

export default Checkpoint;
