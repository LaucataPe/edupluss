import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../redux/store";

const Checkpoint = () => {
  const { id } = useParams();
  const activity = useSelector(
    (state: RootState) => state.activities.activities
  );
  const currentActivity = activity.find((a) => a.id == id);

  return (
    <section className="flex flex-col justify-center  items-center py-3">
      <h3 className=" text-lg md:text-2xl">Checkpoint de {currentActivity?.title}</h3>

      <div className=" w-full h-screen">
        <iframe src={currentActivity?.formURL} className="w-full h-full">
          Cargando…
        </iframe>
      </div>
    </section>
  );
};

export default Checkpoint;
