import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { Button } from "primereact/button";
import { setCurrentArea } from "../../redux/features/areaSlice";
import { Area } from "../../utils/interfaces";

function Admin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const areas = useSelector((state: RootState) => state.areas.areas);

  const areaSelect = (area: Area) => {
    if(area){
      dispatch(setCurrentArea(area))
      navigate(`/areas/${area.id}`)
    }
  }

  return (
    <>
        <div className="m-3">
          <div className="card">
            {areas.length > 0 ? (
                <>
                    <div className="flex justify-between items-center mb-4 mx-3">
                        <h2 className="text-blue-500 text-bol m-0">Áreas:</h2>
                        <div className="h-[50px] flex flex-row-reverse mx-4 gap-2">                      
                            <Button className="hover:bg-blue-500 hover:text-white focus:shadow-none" label=" + Crear Área" severity="info"
                                rounded outlined onClick={() => navigate('/addArea')}></Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mx-3">
                    {areas.map(area => (
                        <div className="card flex flex-wrap m-0 w-[32%] items-center p-3 border border-4" key={area.id}>
                            <h3 className="m-0 w-[75%]">{area.name}</h3>                            
                            <div className="flex justify-end mt-2">
                                <Button rounded className="mr-2" icon="pi pi-pencil" severity="success" onClick={() => navigate(`/editArea/${area.id}`)}></Button>
                                <Button rounded className="mr-2" icon="pi pi-arrow-right" severity="info" onClick={() => areaSelect(area ?? null)}></Button>
                            </div>
                        </div>
                    ))}
                    </div>
                </>
            ) : (
              <div className="text-center">
                <h1 className="mt-2">
                Aún no existen áreas en esta empresa - Crea una para comenzar tu
                experiencia
                </h1>
                <Button onClick={() => navigate('/addArea')} severity='info' rounded outlined>+ Crear Área</Button>
              </div>
            )}
          </div>
        </div>
    </>
  );
}

export default Admin;
