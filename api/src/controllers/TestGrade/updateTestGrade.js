const { User, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { validateUpdateTestGrade } = require('./testGradeSchema');
const patchTestGrade = require('./patchTestGrade');

const updateTestGrade = async (req, res) => {

    try {
        const validation = validateUpdateTestGrade(req.body);
      
        if(!validation.success){
          return res.status(400).json({message: validation.error.issues[0].message})
        }
        const testGradeUpdated = await patchTestGrade(validation.data);
      
        if(typeof testGradeUpdated === "string"){
          return res.status(404).json({message: testGradeUpdated})
        }
      
        res.status(200).json(testGradeUpdated)
      } catch (error) {
        res.status(500).json({error: error})
      }
};

module.exports = { updateTestGrade: catchedAsync(updateTestGrade) };