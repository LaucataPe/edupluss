import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Empresa } from "../utils/interfaces";
import { useDispatch } from "react-redux";
import { setEmpresa } from "../redux/features/activitiesSlice";

function SelectEmpresa() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [idEmpresa, setIdEmpresa] = useState<string>("");
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const empresas = await axios("http://localhost:3001/empresas");
        setEmpresas(empresas.data);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchEmpresas();
  }, []);

  const handleSelect = () => {
    const findEmpresa = empresas.find(
      (empresa) => empresa.id === Number(idEmpresa)
    );
    if (findEmpresa) {
      dispatch(setEmpresa(findEmpresa));
      window.localStorage.setItem("empresa", findEmpresa.name);
    }
  };

  return (
    <>
      <h1 className="text-center text-4xl p-3">Selecciona una empresa</h1>
      <br />
      <div className="flex px-20  ">
        <select
          name="empresa"
          value={idEmpresa}
          onChange={(e) => setIdEmpresa(e.target.value)}
          className="py-3 px-4 pr-9 mx-5 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
        >
          <option>Seleccione la empresa</option>
          {empresas?.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nit} - {empresa.name}
            </option>
          ))}
        </select>
        <Link to="/">
          <button
            disabled={idEmpresa.length === 0 ? true : false}
            onClick={handleSelect}
            className="py-3 px-4 cursor-pointer justify-center items-center rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            Ingresar
          </button>
        </Link>
        <p>{error ? error : ""}</p>
      </div>
    </>
  );
}

export default SelectEmpresa;
