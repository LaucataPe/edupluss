//Express
const express = require("express");
const router = express.Router();
const verifyRole = require("../Middlewares/verifyRole")

//GET Controllers
const { getEmpresaAreas } = require("../controllers/Company/getEmpresaArea");
const {
  getAllActivities,
} = require("../controllers/Activities/getAllActivities");
const { getStepsActivity } = require("../controllers/Steps/getStepsActivity");
const { getAllSteps } = require("../controllers/Steps/getStep");

const { SearchActivity } = require("../controllers/Activities/SearchActivity");
const { getAllCompanies } = require("../controllers/Company/getAllEmpresas");
const {
  getActivitiesByArea,
} = require("../controllers/Areas/getActivitiesByArea");
const { getCompanyActivities } = require('../controllers/Company/getCompanyActivities');
const { getReviewsByActivity } = require('../controllers/Reviews/getReviewsByActivity');
const { getCompanyRoles } = require("../controllers/Roles/getCompanyRoles");


const { getReviewsByUser } = require('../controllers/Reviews/getReviewsByUser');

const { getTestGrade } = require("../controllers/TestGrade/getTestGrade");
const { getAllTestGradesByUser } = require("../controllers/TestGrade/getAllTestGradesByUser");
const { getGradesOfAllEmployeesByActivity } = require("../controllers/TestGrade/getGradesOfAllEmployeesByActivity");
const { getGradePercentageByCompany } = require("../controllers/TestGrade/getGradePercentageByCompany");

//USER GET
const { getAllUsers } = require("../controllers/Users/getAllUsers");
const { getUserByCompany } = require("../controllers/Users/getUsersByCompany");
const { getUserAreas } = require("../controllers/Users/getUserAreas");
const { getByToken } = require("../controllers/Users/getUserToken");
const { getActivitiesByRole } = require("../controllers/Roles/getActivitiesByRole");
const { getRolesByArea } = require("../controllers/Roles/getRolesByArea");
const { getUserSteps } = require("../controllers/UserStep/getUserStep");
const { checkSession } = require("../Middlewares/session");

router.get("/empresas",getAllCompanies);
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
router.get("/users", getAllUsers);
router.get("/users/:companyId", getUserByCompany);
router.get("/user/areas/:id", getUserAreas);

router.get("/userStep", getUserSteps);

router.get('/reviews/activity', getReviewsByActivity);
router.get('/reviews/user', getReviewsByUser);

router.get('/test', getTestGrade);
router.get('/tests', getAllTestGradesByUser);
router.get('/tests/activity', getGradesOfAllEmployeesByActivity);
router.get('/tests/company/:id', getGradePercentageByCompany);


//Session
router.get("/auth/token", getByToken);

//POST Controllers
const { createUser } = require('../controllers/Users/postUser');
const { logUser } = require('../controllers/Users/logUser');
const { createCompany } = require('../controllers/Company/createEmpresa');
const { createArea } = require('../controllers/Areas/createArea');
const { createRole } = require('../controllers/Roles/createRole');
const { createActivity } = require('../controllers/Activities/createActivity');
const { createStep } = require('../controllers/Steps/createStep');
const { postUserStepValidation } = require('../Middlewares');
const { postUserStep } = require('../controllers/UserStep');
const { createReview } = require('../controllers/Reviews/createReview');
const { postTestGrade } = require("../controllers/TestGrade/postTestGrade");
const {realizarPago} = require("../controllers/payU/payU")
//POST
router.post('/empresa', createCompany);
router.post('/user', createUser);
router.post('/logUser', logUser);
router.post('/area', createArea);
router.post('/role', createRole);
router.post('/activity', createActivity);
router.post('/step', createStep);
router.post('/userStep', postUserStepValidation, postUserStep);
router.post('/review', createReview);
router.post('/test', postTestGrade);
router.post('/pagos', realizarPago)
//PUT Controllers
const { ActivityState } = require("../controllers/Activities/ActivityState");
const { AreaState } = require("../controllers/Areas/AreaState");
const { updateArea } = require("../controllers/Areas/updateArea");
const { updateActivity } = require("../controllers/Activities/updateActivity");
const { updateUser } = require("../controllers/Users/updateUser");
const { updateRole } = require("../controllers/Roles/updateRole");
const { updateStep } = require("../controllers/Steps/updateStep");
const { updateTestGrade } = require("../controllers/TestGrade/updateTestGrade");

//PUT
router.put("/activity/state", ActivityState);
router.put("/area/state", AreaState);
router.put("/user/update", updateUser);
router.put("/role/update", updateRole);
router.put("/area/update", updateArea);
router.put("/step/update", updateStep);
router.put("/test/update", updateTestGrade);
router.patch("/activity/update", updateActivity);

//DELETE Controllers
const { deleteAreaCascade } = require("../controllers/Areas/deleteArea");
const { deleteActivity } = require("../controllers/Activities/deleteActivity");
const { deleteStep } = require("../controllers/Steps/deleteStep");
const { deleteUser } = require("../controllers/Users/deleteUser");
const { deleteRole } = require("../controllers/Roles/deleteRole");
const { deleteReview } = require('../controllers/Reviews/deleteReview');

//DELETE
router.delete("/area/:id", deleteAreaCascade);
router.delete("/activity/:id", deleteActivity);
router.delete("/role/:id", deleteRole);
router.delete("/step/:id", deleteStep);
router.delete("/user/:id", deleteUser);
router.delete('/reviews', deleteReview);

module.exports = { router };
