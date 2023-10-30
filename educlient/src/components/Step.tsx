import { useEffect } from "react";
import { Step } from "../utils/interfaces";
import { Button } from "primereact/button";
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
    //console.log(activityId, activeIndex, step);
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
