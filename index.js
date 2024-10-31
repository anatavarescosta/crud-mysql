const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());


const db = require("./db");

(async () => {
    try {            
        const result = await db.selectCustomers();
       
        function buscaUsuario(codapiusuario){
            return result.findIndex(usu=>{
                return usu.codapiusuario === Number(codapiusuario);
            })
        }         
        
        app.get("/",(req,res)=>{
            res.status(200).send("Curso de node.js")
        });
        
        app.get("/usuarios",(req,res)=>{    

            const authHeader = req.headers['token'];                       
            const secretKey = '816aaa526f83d5d199e20079f6aea035';
           
            if (authHeader){

                if (authHeader === secretKey){
                    res.status(200).json(result);
                }else{
                    res.status(401).json({ message: "Token invalido" }); 
                }

            }else{
                res.status(401).json({ message: "Adicione token" });                 
            }
        });
        
        app.get("/usuarios/:codapiusuario",(req,res)=>{
            const index = buscaUsuario(req.params.codapiusuario);
            res.status(200).json(result[index]);            
         });         
        
        
         app.post("/usuarios",(req,res)=>{

            const authHeader = req.headers['token'];                       
            const secretKey = '816aaa526f83d5d199e20079f6aea035';
           
            if (authHeader){

                if (authHeader === secretKey){
                    
                    const nome = req.body.nome.substring(0,255);
                    const email = req.body.email.substring(0,255);
                    
                    const inseirdos = db.InsertCustomers(nome,email);                   
                    //res.sendStatus(200).send("Usuário inserido com sucesso.");

                    res.status(200).json({message: "Usuário inserido com sucesso.",usuario:inseirdos});
                    
                }else{
                    res.status(401).json({ message: "Token invalido" }); 
                }

            }else{
                 res.status(401).json({ message: "Adicione token" });                 
            }

        });

                
        app.put("/usuarios/:codapiusuario",(req,res)=>{
            
            const index = buscaUsuario(req.params.codapiusuario);
            
            if (result[index]){
                const codapiusuario = req.params.codapiusuario;
                const nome = req.body.nome.substring(0,255);
                const email = req.body.email.substring(0,255);

                db.UpdateCustomers(nome,email,codapiusuario);

                res.status(200).json(result[index]);
            }else{
                res.status(401).json({ message: "Código não encontrado" });      
            }
        })
        
        app.delete("/usuarios/:codapiusuario",(req,res)=>{

            try{
                const codapiusuario = req.params.codapiusuario;
                const index = buscaUsuario(req.params.codapiusuario);
                
                db.DeleteCustomers(codapiusuario);
                result.splice(index,1);
    
                res.status(200).send("Usuário removido com sucesso.");
            }catch(erro){
                res.status(500).json({message: `${erro.message} - Falha ao remover um usuario`});
            }

            
        })
     

    } catch (err) {
        console.log(err)
    }

    
})()

app.listen(4000,()=>{

    // console.log("Aplicação rodando na porta 4000");
 })