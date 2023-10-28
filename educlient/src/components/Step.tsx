import { useEffect, useState } from "react";
import { Step } from "../utils/interfaces";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
type props = {
  step: Step;
  activityId: string;
  activeIndex: number;
};

function CurrentStep({ step, activityId, activeIndex }: props) {
  useEffect(() => {
    const currentStep = window.localStorage.getItem(`Activity ${activityId}`);
    if (currentStep !== null) {
      const value = JSON.parse(currentStep);
      activeIndex > value
        ? window.localStorage.setItem(
            `Activity ${activityId}`,
            JSON.stringify(activeIndex)
          )
        : null;
    }
    console.log(activityId, activeIndex, step);
  }, [activeIndex]);

  const getYouTubeEmbedLink = (videoLink: string) => {
    if (videoLink) {
      const videoId = videoLink.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
  };
  const handleDownload = () => {
    if (step.file) {
      window.open(step.file, "_blank");
    }
  }; //@ts-ignore

  const logUser = useSelector((state: RootState) => state.user.logUser.id);
  // console.log(logUser);
  //@ts-ignore
  const [excelData, setExcelData] = useState([]);
  const idUser: string = "2";
  const idActivity: string = "1";
  const excelURL =
    "https://docs.google.com/spreadsheets/d/1IMLZhFH58L_0QFADdsF8ykL-oasWpR2OoEeM4tK9mTs/edit?usp=sharing";
  //otro excel: https://docs.google.com/spreadsheets/d/1SfI2ZN8MUEhpiHlyvuahcLJakrJ08rtjKkWYDYUlTB4/edit?usp=sharing

  const handleExcelImport = async () => {
    try {
      const url = excelURL; // Reemplaza con la URL de tu archivo Excel

      // Realiza una solicitud GET para obtener el archivo Excel
      const response = await axios.get(url, { responseType: "arraybuffer" });

      // Lee el archivo Excel y conviértelo en un objeto de datos
      const excelArrayBuffer = response.data;
      const workbook = XLSX.read(new Uint8Array(excelArrayBuffer), {
        type: "array",
      });
      const sheetName = workbook.SheetNames[0]; // Suponiendo que solo hay una hoja en el archivo Excel

      // Convierte la hoja de Excel en un array de objetos JSON
      const excelArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Encuentra la última fila no vacía en excelArray
      let lastNonEmptyRow = null;
      for (let i = excelArray.length - 1; i >= 0; i--) {
        //@ts-ignore

        if (Object.keys(excelArray[i]).length > 3) {
          lastNonEmptyRow = excelArray[i];
          break;
        }
      }

      // Verifica si se encontró una fila no vacía
      if (lastNonEmptyRow) {
        // Asigna los valores de idUser e idActivity a la última fila no vacía
        //lastNonEmptyRow.idUser = idUser;
        //lastNonEmptyRow.idActivity = idActivity;

        let obj = {
          //@ts-ignore

          gradeValue: lastNonEmptyRow.B,
          activityId: idActivity,
          userId: idUser,
        };
        try {
          const response = await axios.post("http://localhost:3001/test", obj);
          console.log(response.data);
        } catch (error: any) {
          console.log(error);
        }
      } else {
        console.log("No se encontraron filas de datos en el archivo Excel.");
      }

      for (let key in excelArray) {
        if (
          //@ts-ignore

          Object.keys(excelArray[key]).length < 2 && //@ts-ignore
          excelArray[key].hasOwnProperty("__EMPTY") && //@ts-ignore
          excelArray[key].hasOwnProperty("__rowNum__")
        ) {
          delete excelArray[key];
        }
      }
      // console.log(excelArray);
      // Actualiza el estado con los datos del Excel
      //@ts-ignore

      setExcelData(excelArray);
    } catch (error) {
      console.error("Error al importar datos desde Excel:", error);
    }
  };

  useEffect(() => {
    return () => {
      handleExcelImport();
    };
  }, []);

  return (
    <>
      {step ? (
        <div
          key={step?.number}
          className={`flex ${
            step?.design === "col"
              ? "flex-col justify-content-center align-items-center"
              : ""
          }  my-[5rem] w-[100%]`}
        >
          <div
            className={`flex-wrap ${
              step?.design === "col"
                ? "flex-col justify-content-center align-items-center "
                : ""
            } justify-center my-4 w-6 mx-5 break-words`}
          >
            <h1 className="text-bold">{step?.title}</h1>
            <p>{step?.description}</p>
            {step.file ? (
              <Button
                type="button"
                label="Descargar Adjunto"
                icon="pi pi-download"
                severity="info"
                onClick={handleDownload}
              />
            ) : (
              ""
            )}
          </div>

          <div className="flex justify-center w-10">
            {step?.video.includes("youtube") ? (
              <iframe
                width="700"
                height="350"
                src={getYouTubeEmbedLink(step.video)}
                title="Youtube video"
                allowFullScreen
              ></iframe>
            ) : (
              <video src={step.video} width="700" height="350" controls></video>
            )}
          </div>
        </div>
      ) : (
        <h1>Esta actividad no tiene pasos</h1>
      )}
    </>
  );
}

export default CurrentStep;
