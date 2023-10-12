import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getActivitiesByRole } from "../../redux/features/activitiesSlice";
import { Button } from "primereact/button";
import { Activity } from "../../utils/interfaces";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import ActivitiesList from "./ActivitiesList";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function AdminActivities() {
  const { roleId } = useParams();
  const dispatch = useAppDispatch();
  const [activitiesList, setActivitiesList] = useState<Activity[]>([]);

  const activities = useSelector(
    (state: RootState) => state.activities.activities
  );
  const [enableDrag, setEnableDrag] = useState<Boolean>(true);

  useEffect(() => {
    if (activities.length === 0 && roleId) {
      dispatch(getActivitiesByRole(Number(roleId)));
    }
  }, [roleId]);

  useEffect(() => {
    setActivitiesList([...activities].sort((a, b) => a.orderId - b.orderId));
  }, [activities]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active.id !== over.id) {
      setActivitiesList((people) => {
        const oldIndex = people.findIndex((person) => person.id === active.id);
        const newIndex = people.findIndex((person) => person.id === over.id);
        return arrayMove(people, oldIndex, newIndex);
      });
    }
  };

  const updateOrder = async () => {
    try {
      setEnableDrag(!enableDrag);
      if (!enableDrag) {
        let newActivitiesOrderList = [];
        activitiesList.forEach((e, i) => {
          newActivitiesOrderList.push({ id: e.id, orderId: i });
        });
        await axios.put(
          `http://localhost:3001/activities/${roleId}`,
          newActivitiesOrderList
        );
        dispatch(getActivitiesByRole(Number(roleId)));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/*Mapea todas las actividades*/}
      <div className="card p-fluid my-3 h-[720px] overflow-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-blue-500 text-bol m-0">Actividades:</h3>

          <div className="h-[50px] flex flex-row-reverse mx-4 gap-2">
            <div>
              <Button
                className={
                  enableDrag
                    ? "hover:bg-green-500 hover:text-white focus:shadow-none"
                    : "bg-green-500 text-white focus:shadow-none"
                }
                label={enableDrag ? "Editar Orden" : "Guardar Cambios"}
                severity="success"
                outlined
                rounded
                onClick={() => updateOrder()}
              />
            </div>
            <Link to={`/addActivity/${roleId}/${activities.length}`}>
              <Button
                disabled={!enableDrag}
                className="hover:bg-blue-500 hover:text-white focus:shadow-none"
                label="Crear Actividad"
                severity="info"
                rounded
                outlined
              ></Button>
            </Link>
          </div>
        </div>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activitiesList}
            strategy={verticalListSortingStrategy}
          >
            {activitiesList?.map((act, i) => (
              <ActivitiesList act={act} key={i} enableDrag={enableDrag} />
            ))}
          </SortableContext>
        </DndContext>

        {activities.length === 0 ? (
          <h3>No hay actividades para este cargo</h3>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default AdminActivities;
