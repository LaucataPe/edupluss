import { Step } from "../utils/interfaces";

type props = {
    step: Step
}

function CurrentStep( {step}: props) {
    const getYouTubeEmbedLink = (videoLink: string) => {
      const videoId = videoLink.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    };
    return (
      <>
      {step ? (
        <div key={step?.number} className="flex my-[5rem] w-[100%]">
          <div className="w-6">
            <h1 className="text-bold">{step?.title}</h1>
            <p>{step?.description}</p>
          </div>
          

          <div className="flex justify-center w-10">  
            {step?.video.includes('youtu') ?  
              <iframe width="700" height="350" src={getYouTubeEmbedLink(step.video)} title="Youtube video" allowFullScreen></iframe> :
              <video src={step.video} width='700' height='350' controls></video>
            }
          </div>
        </div>
      ): <h1>Esta actividad no tiene pasos</h1>}
      
      </>
    );
  }
  
  export default CurrentStep;