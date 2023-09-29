const server = require('./src/app');
const { conn } = require('./src/db');

conn.sync({ force: false }).then(() => {
  console.log('Database connected, master');
  server.listen(server.get('port'), () => {
    console.log(`Server on port: ${server.get('port')}`);
  });
});
