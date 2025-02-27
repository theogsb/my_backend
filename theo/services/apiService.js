import axios from "axios"

const API_LOGIN_URL = "https://bora-impactar-prd.setd.rdmapps.com.br/api/login.json"

const authenticateWithApi = async (email, password) => {
    try {
        const response = await axios.post(API_LOGIN_URL, {email, password});

        if (response.data.message === "Login bem-sucedido") {
            return response.data;
        } else {
            console.log("Falha no login");
        }
    } catch (error) {
        console.error(error);
    }

};

export default { authenticateWithApi };