import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { CreateStep } from "../../utils/interfaces";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getStepsActivity } from "../../redux/features/stepsSlider";
import { RootState } from "../../redux/store";

import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

import { StepErrors, validate } from "../../utils/validateSteps";
import { uploadFile } from "../../firebase/config";

import col from "../../assets/col.png";
import row from "../../assets/row.png";
import { handleVideoUpload } from "../../utils/cloudinary";

function AddStep() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id, stepId } = useParams();
  const steps = useSelector((state: RootState) => state.steps.steps);

  const toast = useRef<Toast>(null);

  const [stepNumber, setStepNumber] = useState(1);
  const [step, setStep] = useState<CreateStep>({
    id: 0,
    number: stepNumber,
    title: "",
    description: "",
    video: "",
    design: "",
    file: "",
    activityId: Number(id),
  });
  const [errors, setErrors] = useState<StepErrors>({ title: "" });
  const [changeVideo, setChangeVideo] = useState<boolean>(false);
  const [changeFile, setChangeFile] = useState<boolean>(false);

  //Videos
  const [videoOrigin, setVideoOrigin] = useState<boolean>(false);
  const [videoURL, setVideoURL] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  //Loader
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (steps.length === 0) {
      dispatch(getStepsActivity(Number(id)));
    }
  }, []);

  useEffect(() => {
    if (stepId) {
      const findStep = steps.find((step) => step.id === Number(stepId));
      if (findStep) {
        setStep(findStep);
        setStepNumber(findStep.number);
      }
    } else {
      const NextStep = () => {
        const stepsOrder = [...steps].sort((a, b) => b.number - a.number);
        if (stepsOrder.length > 0) {
          const nextNumber = stepsOrder[0].number + 1;
          setStepNumber(nextNumber);
        }
      };
      NextStep();
    }
  }, [stepId]);

  const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStep({ ...step, [event.target.name]: event.target.value });

    setErrors(
      validate({
        ...step,
        title: event.target.value,
      })
    );
  };

  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStep({ ...step, [event.target.name]: event.target.value });

    setErrors(
      validate({
        ...step,
        [event.target.name]: event.target.value,
      })
    );
  };

  const handleVideoOrigin = (checked: boolean) => {
    setVideoOrigin(checked);
    setStep({ ...step, video: "" });
    setErrors(validate({ ...step, video: "" }));
    // Resetear los valores al cambiar el origen del video
    setVideoURL("");

    setVideoFile(null);
  };

  const handleVideoURL = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoURL(event.target.value);
    setVideoFile(null);
    setStep({ ...step, [event.target.name]: event.target.value });
    setErrors(
      validate({
        ...step,
        video: event.target.value,
      })
    );
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const file = e.target.files[0];
      if (file) {
        setVideoFile(file); // Almacenar el archivo localmente
        setErrors(
          validate({
            ...step,
            video: file,
          })
        );
        setVideoURL(""); // Limpiar la URL si está presente
      }
    }
  };

  const deleteDownloadFile = () => {
    setStep({ ...step, file: "" });
    setErrors(validate({ ...step }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let updatedStep = { ...step }; // Crear una copia del paso

      if (step.file instanceof File) {
        // Subir el archivo a Firebase y obtener el enlace de descarga
        const fileUpload = await uploadFile(step.file);
        // Asignar el enlace devuelto al estado del paso
        updatedStep.file = fileUpload;
      }

      // Esperar a que se cargue el archivo de video si es necesario
      if (videoFile) {      
        try {
          updatedStep.video = await handleVideoUpload(videoFile);
        } catch (error: any) {
            setErrors({
              ...errors,
              video: `Se presentó un error al subir el video: ${error.message}`,
            });
        }
      }
      let response = await axios.post(
        `http://localhost:3001/step`,
        updatedStep
      );
      let data = response.data;
      if (data) {
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "Paso creado",
          life: 3000,
        });
        navigate(`/actvitySteps/${id}`);
        setStep({
          number: stepNumber,
          title: "",
          design: "",
          description: "",
          video: "",
          activityId: Number(id),
        });
      }
    } catch (error: any) {
      console.log(error);

      setErrors({
        ...errors,
        send: `Se presentó el siguiente error al enviar ${error.response.data}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let updatedStep = { ...step }; // Crear una copia del paso

      if (step.file instanceof File) {
        // Subir el archivo a Firebase y obtener el enlace de descarga
        const fileUpload = await uploadFile(step.file);
        // Asignar el enlace devuelto al estado del paso
        updatedStep.file = fileUpload;
      }

      // Esperar a que se cargue el archivo de video si es necesario
      if (videoFile) {      
        try {
          updatedStep.video = await handleVideoUpload(videoFile);
        } catch (error: any) {
            setErrors({
              ...errors,
              video: `Se presentó un error al subir el video: ${error.message}`,
            });
        }
      }

      let response = await axios.put(
        `http://localhost:3001/step/update`,
        updatedStep
      );
      let data = response.data;
      if (data) {
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "Paso creado",
          life: 3000,
        });
        navigate(`/actvitySteps/${id}`);
        setStep({
          number: stepNumber,
          title: "",
          description: "",
          design: "",
          video: "",
          activityId: Number(id),
        });
      }
    } catch (error: any) {
      console.log(error);
      setErrors({
        ...errors,
        send: `Se presentó el siguiente error al enviar ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
		<Link to={`/actvitySteps/${id}`}>
			<Button icon="pi pi-angle-double-left" label="Atrás" rounded severity="secondary" className="mt-3 mx-3 mb-2" />
		</Link>
		<form>
			<div className="card p-fluid mx-3">
				<h5>Paso #{stepNumber}</h5>
				<div className="field">
					<label>Título:</label>
					<InputText name="title" type="text" placeholder="Ingrese el título para este paso"value={step.title}
						onChange={(e) => handleInputs(e)} className={errors.title ? "p-invalid" : ""}/>
					<p className="font-semibold text-red-600">{errors.title ? errors.title : ""}</p>
				</div>
				<div className="field">
					<label>Descripción:</label>
					<InputTextarea name="description" rows={2} placeholder="Ingrese una breve descripción" value={step.description}
						onChange={(e) => handleDescription(e)} className={errors.description ? "p-invalid" : ""}/>
					<p className="font-semibold text-red-600">{errors.description ? errors.description : ""}</p>
				</div>
				<div className="field">
					<div className="flex my-3">
					<label className="m-0">
						{stepId ? "Cambiar Video:" : "Agregar Video:"}
					</label>
					{stepId && (
						<input
						type="checkbox"
						checked={changeVideo}
						onChange={() => setChangeVideo(!changeVideo)}
						className="mx-2"
						/>
					)}
					</div>
					<div className="flex items-center my-2">
					Archivo
					<InputSwitch
						checked={videoOrigin}
						onChange={(e) => handleVideoOrigin(e.value ?? false)}
						className="mx-2"
						disabled={stepId ? !changeVideo : false}
					/>
					Url
					</div>

					{videoOrigin ? (
					<InputText
						name="video"
						type="text"
						placeholder="Ingrese una url"
						value={videoURL}
						onChange={(e) => handleVideoURL(e)}
						className={errors.video ? "p-invalid" : ""}
						disabled={stepId ? !changeVideo : false}
					/>
					) : (
					<input
						type="file"
						name="video"
						onChange={(e) => handleVideo(e)}
						accept="video/*"
						size={16000000}
						disabled={stepId ? !changeVideo : false}
						className="mb-2"
					/>
					)}
					<p className="font-semibold text-red-600">
					{errors.video ? errors.video : ""}
					</p>
				</div>
				<div className="field">
					<div className="flex my-3 items-center">
					<label className="m-0">
						{stepId && step.file
						? "Cambiar Archivo Descargable:"
						: "Agregar Archivo Descargable:"}
					</label>
					{stepId && (
						<input
						type="checkbox"
						checked={changeFile}
						onChange={() => setChangeFile(!changeFile)}
						className="mx-2"
						/>
					)}
					{stepId && step.file && !(step.file instanceof File) ? (
						<div className="flex items-center ml-5">
						<p className="text-red-600 m-0">Eliminar archivo actual</p>
						<Button
							icon="pi pi-times"
							rounded
							severity="danger"
							text
							onClick={deleteDownloadFile}
						/>
						</div>
					) : (
						""
					)}
					</div>
					<InputText
					name="file"
					type="file"
					onChange={(e) => setStep({ ...step, file: e.target.files?.[0] })}
					disabled={stepId ? !changeFile : false}
					accept=".pdf,.doc,.docx,.xls,.xlsx,image/jpeg,image/png,image/gif"
					className="mb-2"
					/>
					<p>Seleccionar diseño:</p>
					<div className="flex">
					<div>
						<label className="flex justify-content-center">
						<input
							type="radio"
							name="design"
							value="col"
							checked={step.design === "col"}
							onChange={(e) =>
							setStep({ ...step, design: e.target.value })
							}
						/>
						Columna
						</label>
						<img src={col} />
					</div>
					<div>
						<label className="flex justify-content-center">
						<input
							type="radio"
							name="design"
							value="row"
							checked={step.design === "row"}
							onChange={(e) =>
							setStep({ ...step, design: e.target.value })
							}
						/>
						Fila
						</label>
						<img src={row} />
					</div>
					</div>
					<Button
					label={stepId ? "Editar" : "Crear Paso"}
					severity="info"
					outlined
					type="submit"
					className=" mt-4"
					onClick={(e) => {
						!stepId ? handleSubmit(e) : handleEdit(e);
					}}
					disabled={Object.keys(errors).length > 0 ? true : false}
					loading={isLoading}
					/>
				</div>
			</div>
		</form>
		<p className="font-semibold text-red-600">
			{errors.send ? errors.send : ""}
		</p>
    </>
  );
}

export default AddStep;
