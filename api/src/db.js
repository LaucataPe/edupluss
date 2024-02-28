require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/edupluss`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

/*const sequelize = new Sequelize('DB_NAME', DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true,
    json: true
  }
});*/

async function probandoDb() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

probandoDb();

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const {
  Company,
  Step,
  Activity,
  User,
  Area,
  Role,
  UserStep,
  TestGrade,
  Review,
  Subscription,
} = sequelize.models;
console.log(sequelize.models);

// Aca vendrian las relaciones
Company.hasMany(Area, {
  foreignKey: "companyId",
});

Company.hasMany(Role, {
  foreignKey: "companyId",
});

Company.hasMany(User, {
  foreignKey: "companyId",
});

User.belongsTo(Company, {
  foreignKey: "companyId",
});

Area.hasMany(Role, {
  foreignKey: "areaId",
});

Role.hasMany(Activity, {
  foreignKey: "roleId",
});

Activity.hasMany(Step, {
  foreignKey: "activityId",
});

Role.hasMany(User, {
  foreignKey: "roleId",
});

User.belongsTo(Role, {
  foreignKey: "roleId",
});

User.belongsToMany(Step, {
  through: UserStep,
  as: "Steps",
  foreignKey: "UserId",
});

Step.belongsToMany(User, {
  through: UserStep,
  as: "Users",
  foreignKey: "StepId",
});

Activity.hasMany(TestGrade, {
  foreignKey: "activityId",
});

TestGrade.belongsTo(Activity, {
  foreignKey: "activityId",
});

User.hasMany(TestGrade, {
  foreignKey: "userId",
});

TestGrade.belongsTo(User, {
  foreignKey: "userId",
});

Activity.hasMany(Review, {
  foreignKey: "activityId",
});

User.hasMany(Review, {
  foreignKey: "userId",
});

/* User.hasMany(UserActivityStep, {
   foreignKey: 'userId'
 }); */
Activity.belongsTo(Company, {
  foreignKey: "companyId",
});

User.beforeUpdate((user) => {
  try {
    user.tipo === "admin" && user.roleId ? (user.roleId = null) : null;
  } catch (error) {
    throw new Error(
      "Solo los usuarios de tipo: empleado pueden tener un rol",
      error
    );
  }
});

Subscription.belongsTo(Company, {
  foreignKey: "companyId",
  onDelete: "CASCADE", // Esto eliminará la suscripción si se elimina la empresa
});

Company.hasMany(Subscription, {
  foreignKey: "companyId",
});

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
