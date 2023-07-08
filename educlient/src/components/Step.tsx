import { Step } from "../utils/demodb";

type props = {
    step: Step
}

function CurrentStep( {step}: props) {
    return (
      <>
      {step ? (
        <div key={step?.number}>
          <h1>{step?.title}</h1>
          <p>{step?.description}</p>
          {step?.video.includes('youtube') ? 
            <iframe width="560" height="315" src='https://www.youtube.com/watch?v=ptc4Awb0UpU' 
            title="YouTube video player" allow="accelerometer; autoplay; 
            clipboard-write; encrypted-media; gyroscope; picture-in-picture;
            web-share" allowFullScreen></iframe> :
            <video src={step.video} width='500' height='350' controls></video>
          }
        </div>
      ): <h1>Esta actividad no tiene pasos</h1>}
      
      </>
    );
  }
  
  export default CurrentStep;