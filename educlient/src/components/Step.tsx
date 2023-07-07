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
          <video src={step?.video} width='500' height='350' controls></video>
        </div>
      ): <h1>Esta actividad no tiene pasos</h1>}
      
      </>
    );
  }
  
  export default CurrentStep;