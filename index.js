// importar arquivos (exemplo)
// require('./modules/path.js');
// require('./modules/http.js');
// require("./modules/fs.js");

// importar classes
// const { Person } = require("./person.js");
// const person = new Person("Marcos");

const dotenv = require('dotenv');
const connectToDatabase = require('./src/database/connect.js');

dotenv.config();

connectToDatabase();

require('./src/services/express.js');
require('./src/routes/routes.js');
