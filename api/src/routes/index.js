//Express
const express = require('express')
const router = express.Router()

//GET Controllers
const {getEmpresaActivity} = require('../controllers/Empresa/getEmpresaActivity')
const {getAllActivities} = require('../controllers/Activities/getAllActivities')
const {getStepsActivity} = require('../controllers/Steps/getStepsActivity')
const {SearchActivity} = require('../controllers/Activities/SearchActivity')
const {getAllEmpresas} = require('../controllers/Empresa/getAllEmpresas')

router.get('/empresas', getAllEmpresas)
router.get('/activities/:empresaId', getEmpresaActivity)
router.get('/activities', getAllActivities)
router.get('/steps/:id', getStepsActivity)
router.get('/search', SearchActivity)

//POST Controllers
const {createActivity} = require('../controllers/Activities/createActivity')
const {createEmpresa} = require('../controllers/Empresa/createEmpresa')
const {createStep} = require('../controllers/Steps/createStep')

//POST
router.post('/activity', createActivity)
router.post('/empresa', createEmpresa)
router.post('/step', createStep)

//PUT Controllers
const {ActivityState} = require('../controllers/Activities/ActivityState')

//PUT
router.put('/activity/state', ActivityState)


//DELETE Controllers
const {deleteActivity} = require('../controllers/Activities/deleteActivity')
const {deleteStep} = require('../controllers/Steps/deleteStep')

//DELETE
router.delete('/activity/:id', deleteActivity)
router.delete('/step/:id', deleteStep)

module.exports = {router}
