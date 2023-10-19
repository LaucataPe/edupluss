const { TestGrade, User } = require('../../db');

const patchTestGrade = async(data) => {   
    let testGradeFound;
    
    if(data.id){
        testGradeFound = await TestGrade.findByPk(data.id);
    } else if(data.activityId) {
        testGradeFound = await TestGrade.findOne({where: {
            userId: data.userId,
            activityId: data.activityId,
        }});
    }

    if (!testGradeFound) return('No se encontó una calificación con los datos proporcionados');
    testGradeFound.set(data).save();

    return testGradeFound;
}

module.exports = patchTestGrade;