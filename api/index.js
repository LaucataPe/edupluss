const server = require('./src/app')
const {conn} = require('./src/db')

conn.sync({force: false}).then(() =>{
    console.log('Database connected, master');
    server.listen(3001, () =>{
        console.log('Server on port: 3001');
    })
})
