import { useEffect, useState } from "react";
import axios from "axios";
import { Empresa } from "../../utils/interfaces";
import Crud from "../admin/Crud";
import { useAppDispatch } from "../../hooks/typedSelectors";
import {
  changeCurrentCompany,
  getUsersByCompany,
} from "../../redux/features/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchCompanyAreas } from "../../redux/features/areaSlice";
import { getCompanyRoles } from "../../redux/features/roleSlice";

const UserByCompany = () => {
  const dispatch = useAppDispatch();
  const [companies, setCompanies] = useState([]);
  const currentEmpresa = useSelector(
    (state: RootState) => state.user.logUser.companyId
  );

  useEffect(() => {
    const getCompanies = async () => {
      const res = await axios("http://localhost:3001/empresas");
      const { data } = res;

      setCompanies(data);
    };

    getCompanies();
  }, []);

  useEffect(() => {
    dispatch(getUsersByCompany(currentEmpresa));
    dispatch(fetchCompanyAreas(currentEmpresa));
    dispatch(getCompanyRoles(currentEmpresa));
  }, [dispatch, currentEmpresa]);

  const onOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    dispatch(changeCurrentCompany(value));
  };

  return (
    <section>
      <header className="flex bg-gray-100 justify-center p-3">
        <select onChange={onOptionChange} className="p-2 ">
          {companies.map((company: Empresa) => {
            return <option value={company.id}>{company.name}</option>;
          })}
        </select>
      </header>

      <article>
        <Crud />
      </article>
    </section>
  );
};

export default UserByCompany;
