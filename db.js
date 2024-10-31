const { strict } = require("assert");

 
async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root@localhost:3306/autorizador");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function selectCustomers(){
    const conn = await connect();
    const [rows] = await conn.query('select * from apiusuario');
    return rows;   
    
} 


async function InsertCustomers(nome,email){
    const conn = await connect();

    const sql = 'INSERT INTO apiusuario (nome, email) VALUES (?,?)';
    
    //const values = [nome,email];

    conn.query(sql, [nome,email], function (err, result) {
            if (err) throw err;
                return result.affectedRows;
          });
     
}

async function DeleteCustomers(codapiusuario){

    const conn = await connect();

    const sql = 'DELETE FROM apiusuario where codapiusuario = ? ';
    
    conn.query(sql, [codapiusuario], function (err, result) {
            if (err) throw err;
                return result.affectedRows;
    });
     
}

async function UpdateCustomers(nome,email,codapiusuario){

    const conn = await connect();

    const sql = 'UPDATE apiusuario set nome = ?, email = ?  where codapiusuario = ? ';
    
    conn.query(sql, [nome,email,codapiusuario], function (err, result) {
            if (err) throw err;
                return result.affectedRows;
    });
     
}

 
module.exports = {selectCustomers,InsertCustomers,DeleteCustomers,UpdateCustomers}




