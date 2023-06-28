import { Step } from "../utils/demodb";

type props = {
    step: Step
}

function CurrentStep( {step}: props) {
    return (
      <>
      <div key={step?.number}>
        <h1>{step?.title}</h1>
        <p>{step?.description}</p>
        <h3>{step?.video}</h3>
      </div>
      
      </>
    );
  }
  
  export default CurrentStep;