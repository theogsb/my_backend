// enviar as requisições http com a biblioteca AXIOS 
const axios = require('axios');
const UserModel = require('../models/user.model')

// requisições Get

// const getUsers = () => {
//     return axios.get("http://localhost:8080/users")
//             .then(response => console.log(response.data)) // Axios já retorn JSON automaticamente
//             .catch(error => console.error(error));
// }


const postUser = (user) => {
    
    return axios.post("https://bora-impactar-prd.setd.rdmapps.com.br/api/login.json",{
            "email": "apiteste2@rdmapps.com.br",
            "password": "123456"
        } 
    )
        .then(response => console.log(response))
        .catch(error => console.log(error));
}
