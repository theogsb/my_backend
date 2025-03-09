import app from "../services/express.js";

app.post("/apigov", async (req, res) => {
    
    try {
        const response = await fetch("https://bora-impactar-prd.setd.rdmapps.com.br/api/login.json" ,   {
                    
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(req.body)
            },

        );
        
        const data = await response.json();
        
        console.log(data.ngo.id);
        res.json(data);

    } catch (error) {

        console.log(error);
        res.status(500).json({
            sucess: false,
            message: "Erro ao criar usuário!",
            error: error.message  
        })
    }
});
