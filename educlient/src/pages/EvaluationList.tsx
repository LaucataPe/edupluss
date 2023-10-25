import React, { useEffect, useState } from "react";
import { DataScroller } from 'primereact/datascroller';
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ListEvaluation } from "../utils/interfaces";


function EvaluationList() {
    const logUser = useSelector((state: RootState) => state.user.logUser);
    const [evaluationsList, setEvaluationsList] = useState<ListEvaluation[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getActivitiesOfCompany = async () => {
          try {
            const response = await axios(`http://localhost:3001/admin/activities/${logUser.id}`);
    
            if (response.data) {
                setEvaluationsList(response.data);
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
                <p className=" text-lg md:text-3xl xl:text-4xl text-black">Evaluación de: {title}</p>
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
    return(
        <div className="flex mt-2">
            <div className="col-12 align-items-center ml-2 sm:ml-0">
              <div className="card grid grid-cols-2 mx-1 sm:mx-2 sm:my-2 overflow-hidden h-[700px] md:h-[900px]">
                <p className=" text-xl md:text-4xl  text-cyan-800">Evaluaciones:</p>
                <DataScroller value={evaluationsList} itemTemplate={itemTemplate} className="h-[100%] w-[100%]" rows={1} inline scrollHeight="100%" />     
              </div>
            </div>
        </div>
    )
}

export default EvaluationList;
