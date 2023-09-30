import { Rating } from "primereact/rating";
import { useState } from "react";
// import { useParams } from "react-router-dom";

function RateActivity() {
  // const { id } = useParams();
  const [ratingValue, setRatingValue] = useState<number | null>(null);

  // const handlerSendRate = () => {
  //   //Handler to send the rate given to activity
  // }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center p-4 bg-gray-200 rounded-lg md:p-6">
        <h5 className="mb-1 md:text-2xl">Ayudanos a mejorar</h5>
        <p className=" md:text-lg">Califica esta actividad</p>
        <Rating
          value={ratingValue as number}
          onChange={(e) => setRatingValue(e.value ?? 0)}
        />
      </div>
    </div>
  );
}

export default RateActivity;
