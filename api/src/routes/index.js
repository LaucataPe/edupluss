//Express
const express = require("express");
const router = express.Router();
const verifyRole = require("../Middlewares/verifyRole");

//GET Controllers
const { getEmpresaAreas } = require("../controllers/Company/getEmpresaArea");
const {
  getAllActivities,
} = require("../controllers/Activities/getAllActivities");
const { getStepsActivity } = require("../controllers/Steps/getStepsActivity");
const { getAllSteps } = require("../controllers/Steps/getStep");
const { getStepsByRoleUser } = require("../controllers/Steps/getStepsByRoleUser");

const { SearchActivity } = require("../controllers/Activities/SearchActivity");
const { getAllCompanies } = require("../controllers/Company/getAllEmpresas");
const {
  getActivitiesByArea,
} = require("../controllers/Areas/getActivitiesByArea");
const {
  getCompanyActivities,
} = require("../controllers/Company/getCompanyActivities");
const {
  getReviewsByActivity,
} = require("../controllers/Reviews/getReviewsByActivity");
const { getCompanyRoles } = require("../controllers/Roles/getCompanyRoles");

const { getReview } = require("../controllers/Reviews/getReview");
const { getReviewsByUser } = require("../controllers/Reviews/getReviewsByUser");

const {
  getActivitiesByAdminUser,
} = require("../controllers/Activities/getActivitiesByAdminUser");
const {
  getEmployeesAndGrades,
} = require("../controllers/TestGrade/getEmployeesAndGrades");
const { getTestGrade } = require("../controllers/TestGrade/getTestGrade");
const {
  getAllTestGradesByUser,
} = require("../controllers/TestGrade/getAllTestGradesByUser");
const {
  getGradePercentageByCompany,
} = require("../controllers/TestGrade/getGradePercentageByCompany");

//USER GET
const { getUser }= require("../controllers/Users/getUser");
const { getAllUsers } = require("../controllers/Users/getAllUsers");
const { getUserByCompany } = require("../controllers/Users/getUsersByCompany");
const { getUserAreas } = require("../controllers/Users/getUserAreas");
const { getByToken } = require("../controllers/Users/getUserToken");
const {
  getActivitiesByRole,
} = require("../controllers/Roles/getActivitiesByRole");
const { getRolesByArea } = require("../controllers/Roles/getRolesByArea");
const { getUserSteps } = require("../controllers/UserStep/getUserStep");
const { checkSession } = require("../Middlewares/session");

router.get("/empresas", getAllCompanies);
router.get("/areas/:companyId", getEmpresaAreas);

router.get("/activities", getAllActivities);
router.get("/activities/:companyId", getCompanyActivities);
router.get("/activities/area/:areaId", getActivitiesByArea);

router.get("/company/roles/:companyId", getCompanyRoles);
router.get("/activities/role/:roleId", getActivitiesByRole);
router.get("/roles/:areaId", getRolesByArea);

router.get("/steps/:id", getStepsActivity);
router.get("/search", SearchActivity);
router.get("/steps", getAllSteps);
router.get("/roleSteps/:id", getStepsByRoleUser);
router.get("/user/:id", getUser);
router.get("/users", getAllUsers);
router.get("/users/:companyId", getUserByCompany);
router.get("/user/areas/:id", getUserAreas);

router.get("/userStep", getUserSteps);

router.get("/review", getReview);
router.get("/reviews/activity/:userId/:activityId", getReviewsByActivity); //!NO SE ESTA USANDO
router.get("/reviews/user/:adminId/:employeeId", getReviewsByUser); //!NO SE ESTA USANDO

router.get("/admin/activities/:id", getActivitiesByAdminUser);
router.get(
  "/admin/employeesGrades/:adminId/:activityId",
  getEmployeesAndGrades
);
router.get("/test", getTestGrade);
router.get("/tests/:employeeId", getAllTestGradesByUser);
router.get("/tests/company/:id", getGradePercentageByCompany); //!NO SE ESTA USANDO (retorna un porcentaje)

//Session
router.get("/auth/token", getByToken);

//POST Controllers
const { createUser } = require("../controllers/Users/postUser");
const { logUser } = require("../controllers/Users/logUser");
const { createCompany } = require("../controllers/Company/createEmpresa");
const { createArea } = require("../controllers/Areas/createArea");
const { createRole } = require("../controllers/Roles/createRole");
const { createActivity } = require("../controllers/Activities/createActivity");
const { createStep } = require("../controllers/Steps/createStep");
const { postUserStepValidation } = require("../Middlewares");
const { postUserStep } = require("../controllers/UserStep");
const { createReview } = require("../controllers/Reviews/createReview");
const { postTestGrade } = require("../controllers/TestGrade/postTestGrade");
const { realizarPago } = require("../controllers/payU/payU");
//POST
router.post("/empresa", createCompany);
router.post("/user", createUser);
router.post("/logUser", logUser);
router.post("/area", createArea);
router.post("/role", createRole);
router.post("/activity", createActivity);
router.post("/step", createStep);
router.post("/userStep", postUserStepValidation, postUserStep);
router.post("/review", createReview);
router.post("/test", postTestGrade);
router.post("/pagos", realizarPago);
//router.post("/createSuperAdmin",verifyRole("superadmin"),createSuperAdmin) //ruta de prueba por definir

//PUT Controllers
const { ActivityState } = require("../controllers/Activities/ActivityState");
const { AreaState } = require("../controllers/Areas/AreaState");
const { updateArea } = require("../controllers/Areas/updateArea");
const { updateActivity } = require("../controllers/Activities/updateActivity");
const { updateUser } = require("../controllers/Users/updateUser");
const { updateRole } = require("../controllers/Roles/updateRole");
const { updateStep } = require("../controllers/Steps/updateStep");
const { updateTestGrade } = require("../controllers/TestGrade/updateTestGrade");
const updateEmpresa = require("../controllers/Company/updateEmpresa");
const {
  setOrderActivities,
} = require("../controllers/Activities/setOrderActivities");
const { updatePatchUser } = require("../controllers/Users/updatePatchUser");

//PUT
router.put("/activity/state", ActivityState);
router.put("/area/state", AreaState);
router.put("/role/update", updateRole);
router.put("/area/update", updateArea);
router.put("/step/update", updateStep);
router.put("/user/update", updateUser);
router.patch("/user/patch", updatePatchUser);
router.patch("/test/update", updateTestGrade);
router.patch("/activity/update", updateActivity);
router.patch("/empresa/update", updateEmpresa);
router.put("/activities/:roleId", verifyRole("admin"), setOrderActivities);

//DELETE Controllers
const { deleteAreaCascade } = require("../controllers/Areas/deleteArea");
const { deleteActivity } = require("../controllers/Activities/deleteActivity");
const { deleteStep } = require("../controllers/Steps/deleteStep");
const { deleteUser } = require("../controllers/Users/deleteUser");
const { deleteRole } = require("../controllers/Roles/deleteRole");
const { deleteReview } = require("../controllers/Reviews/deleteReview");
const { deleteTestGrade } = require("../controllers/TestGrade/deleteTestGrade");

//DELETE
router.delete("/area/:id", deleteAreaCascade);
router.delete("/activity/:id", deleteActivity);
router.delete("/role/:id", deleteRole);
router.delete("/step/:id", deleteStep);
router.delete("/user/:companyUsersId", deleteUser); //!verifyRole("admin") Verificar para el caso de admin y superadmin, 
router.delete("/reviews/:adminId/:reviewId", deleteReview); //!NO SE ESTA USANDO
router.delete("/test/:userId/:id", deleteTestGrade);

module.exports = { router };
