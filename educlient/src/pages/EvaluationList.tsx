import React, { useEffect, useState } from "react";
import { DataScroller } from 'primereact/datascroller';
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Activity, ListEvaluation } from "../utils/interfaces";


function EvaluationList() {
    const logUser = useSelector((state: RootState) => state.user.logUser);
    const [evaluationsList, setEvaluationsList] = useState<ListEvaluation[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getActivitiesOfCompany = async () => {
          try {
            const response = await axios(`http://localhost:3001/admin/activities/${logUser.id}`);
    
            if (response.data) {
                const test = response.data.filter((act: Activity) => act.hasTest)
                setEvaluationsList(test);
            } else {
              console.error("La empresa no tiene actividades creadas.");
            }
          } catch (error) {
            console.error("Error al obtener datos de las actividades:", error);
          }
        };
        if(logUser.id !== 0){
          getActivitiesOfCompany();
        }
        
    }, [logUser.id]);

    const handleOnClick = (activityId : number)=> {
        navigate(`/employees/qualifications/${activityId}`)
    }
    
    const startContent = (title : string) => {
        return (
          <React.Fragment>
            <div className="my-2 w-[62vw] lg:w-[58vw] xl:w-[64vw]">
                <p className=" text-lg md:text-3xl xl:text-4xl">Evaluación de: {title}</p>
            </div>
          </React.Fragment>
        );
      };
    
    const endContent = (id: number) => {
        return (
          <React.Fragment>
            <div className="my-2">
              <Button
                label="Resultados"
                className=" primary-900 w-[96px] h-[40px] text-xs md:w-[118px] md:h-[50px] md:text-base"
                onClick={() => handleOnClick(id)}
              />
            </div>
          </React.Fragment>
        );
      };

      const itemTemplate = () => {
        return (
            <div>
            {
              evaluationsList?.map((activity, index)=>(
                <Toolbar className="my-4 overflow-auto" key={index} start={startContent(activity.title)} end={endContent(activity.id)}> 
                </Toolbar>
              ))
            }
            </div>
        )
        }
    return (
      <div className="m-3">
        <div className="flex">
          <div className="col-12 align-items-center ml-2 sm:ml-0">
            <div className="card grid grid-cols-2 overflow-hidden h-[700px] md:h-[900px]">
              <h2 className="text-blue-500">Evaluaciones:</h2>
              <DataScroller
                value={evaluationsList}
                emptyMessage="No se encontraron evaluaciones."
                itemTemplate={itemTemplate}
                className="h-[100%] w-[100%]"
                rows={1}
                inline
                scrollHeight="100%"
              />
            </div>
          </div>
        </div>
      </div>
    );
}

export default EvaluationList;
