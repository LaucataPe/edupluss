//Express
const express = require('express')
const router = express.Router()

//GET Controllers
const {getEmpresaAreas} = require('../controllers/Company/getEmpresaArea')
const {getAllActivities} = require('../controllers/Activities/getAllActivities')
const {getStepsActivity} = require('../controllers/Steps/getStepsActivity')
const {SearchActivity} = require('../controllers/Activities/SearchActivity')
const {getAllCompanies} = require('../controllers/Company/getAllEmpresas')
const {getActivitiesByArea} = require('../controllers/Areas/getActivitiesByArea')
const {getCompanyActivities} = require('../controllers/Company/getCompanyActivities')

//USER GET
const {getAllUsers} = require('../controllers/Users/getAllUsers')
const {getUserByCompany} = require('../controllers/Users/getUsersByCompany')

router.get('/empresas', getAllCompanies)
router.get('/areas/:companyId', getEmpresaAreas)
router.get('/activities', getAllActivities)
router.get('/activities/:companyId', getCompanyActivities)
router.get('/activities/:areaId', getActivitiesByArea)
router.get('/steps/:id', getStepsActivity)
router.get('/search', SearchActivity)

router.get('/users', getAllUsers) 
router.get('/users/:companyId', getUserByCompany) 


//POST Controllers
const {createUser} = require('../controllers/Users/postUser')
const {createCompany} = require('../controllers/Company/createEmpresa')
const {createArea} = require('../controllers/Areas/createArea')
const {createActivity} = require('../controllers/Activities/createActivity')
const {createStep} = require('../controllers/Steps/createStep')

//POST
router.post('/empresa', createCompany)
router.post('/user', createUser)
router.post('/area', createArea)
router.post('/activity', createActivity)
router.post('/step', createStep)

//PUT Controllers
const {ActivityState} = require('../controllers/Activities/ActivityState')
const {AreaState} = require('../controllers/Areas/AreaState')
const {UserState} = require('../controllers/Users/userState')

//PUT
router.put('/activity/state', ActivityState)
router.put('/area/state', AreaState)
router.put('/user/state', UserState)


//DELETE Controllers
const {deleteActivity} = require('../controllers/Activities/deleteActivity')
const {deleteStep} = require('../controllers/Steps/deleteStep')

//DELETE
router.delete('/activity/:id', deleteActivity)
router.delete('/step/:id', deleteStep)

module.exports = {router}


