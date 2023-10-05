import React from 'react'
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import axios from 'axios';
import * as XLSX from 'xlsx';

const Checkpoint = () => {
  const { id } = useParams();
  const activity = useSelector(
    (state: RootState) => state.activities.activities
  );
  const currentActivity = activity.find((a) => a.id == id);
  const logUser = useSelector((state: RootState) => state.user.logUser);

  const [excelData, setExcelData] = useState([]);
  //const excelURL = "https://docs.google.com/spreadsheets/d/1breEC66LlFSvOqcqz1mxfJglzUVlw6TmArQnezWS27o/edit?usp=drive_link"
  //primer excel: https://docs.google.com/spreadsheets/d/1breEC66LlFSvOqcqz1mxfJglzUVlw6TmArQnezWS27o/edit?usp=drive_link
  //otro excel: https://docs.google.com/spreadsheets/d/1SfI2ZN8MUEhpiHlyvuahcLJakrJ08rtjKkWYDYUlTB4/edit?usp=sharing
  const excelURL = currentActivity?.excelURL;
  
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
        const url = excelURL;
    
        // Realiza una solicitud GET para obtener el archivo Excel
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Lee el archivo Excel y conviértelo en un objeto de datos
        const excelArrayBuffer = response.data;
        const workbook = XLSX.read(new Uint8Array(excelArrayBuffer), { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Suponiendo que solo hay una hoja en el archivo Excel

        // Convierte la hoja de Excel en un array de objetos JSON
        const excelArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Encuentra la última fila no vacía en excelArray
        let lastNonEmptyRow = null;
        for (let i = excelArray.length - 1; i >= 0; i--) {
            if (Object.keys(excelArray[i]).length > 3) {
                lastNonEmptyRow = excelArray[i];
                break;
            }
        }
        if (lastNonEmptyRow) {
          const arrayValues = lastNonEmptyRow.B.split(" / ");
    
          let gradeValue = arrayValues[0];
          let maximunGradeValue = arrayValues[1];

          let obj = {
              gradeValue: gradeValue,
              maximunGradeValue: maximunGradeValue,
              activityId: id,
              userId: logUser.id,
          }
          
          try {
              const response = await axios.post('http://localhost:3001/test', obj)
              console.log(response.data);  
              } catch (error: any) {
              console.log(error); 
          }
        } else {
            console.log('No se encontraron filas de datos en el archivo Excel.');
        }

        for (let key in excelArray) {
            if (
              Object.keys(excelArray[key]).length < 2 &&
              excelArray[key].hasOwnProperty("__EMPTY") &&
              excelArray[key].hasOwnProperty("__rowNum__")
            ) {
              delete excelArray[key];
            }
        }
        console.log(excelArray);
        setExcelData(excelArray);
      }
      } catch (error) {
          console.error('Error al importar datos desde Excel:', error);
      }
  };

  return (
    <section className="flex flex-col justify-center  items-center py-3">
      <h3 className=" text-lg md:text-2xl">Checkpoint de {currentActivity?.title}</h3>

      <div className=" w-full h-screen">
        <iframe src={currentActivity?.formURL} className="w-full h-full">
          Cargando…
        </iframe>
      </div>
    </section>
  );
};

export default Checkpoint;
