import { Rating } from "primereact/rating";
import { Nullable } from "primereact/ts-helpers";
import { useState } from "react";
import axios from "axios";
// import { useParams } from "react-router-dom";

 type Props = {
   currentUser:number | undefined
   activityId:number | undefined ,
 }
function RateActivity(Props:Props) {
  // const { id } = useParams();
  const [ratingValue, setRatingValue] = useState<number | null>(null);

   const handlerSendRate = async (rateValue: Nullable <number> ) => {
    
   try {
    const rateDates = {
      text:"test1", 
      rating: rateValue,
      reviewRated: true,
      activityId:Props.activityId, 
      userId:Props.currentUser}
      
      const response = await axios.post(
        "http://localhost:3001/review",
        rateDates
      );
      console.log("review submitted",response)
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log("A previously created review already exists");
      } else {
        console.warn("Error when making POST request:", error);
      }
     }
    }
  // const handlerSendRate = () => {
  //   //Handler to send the rate given to activity
  // }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center m-8 p-8 bg-gray-100 rounded-lg shadow-xl">
          <h5 className="mb-1 text-3xl">Ayudanos a mejorar</h5>
          <p className="text-lg">Califica esta actividad</p>
          <Rating
            value={ratingValue as number}
            onChange={(e) =>{setRatingValue(e.value ?? 0);handlerSendRate(e.value)} }
            style={{ transform: "scale(2)" }}
          />
      </div>
    </div>
  );
}

export default RateActivity;
