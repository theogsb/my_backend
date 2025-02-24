const dotenv = require('dotenv');
const connectToDatabase = require('./src/database/connect.js');

dotenv.config();
connectToDatabase();

require('./src/services/routes');
