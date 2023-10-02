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
      <div className="flex flex-col justify-center items-center m-8 p-8 bg-gray-100 rounded-lg shadow-xl">
        <h5 className="mb-1 text-3xl">Ayudanos a mejorar</h5>
        <p className="text-lg">Califica esta actividad</p>
        <Rating
          value={ratingValue as number}
          onChange={(e) => setRatingValue(e.value ?? 0)}
          style={{ transform: "scale(2)" }}
        />
      </div>
    </div>
  );
}

export default RateActivity;
