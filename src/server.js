const app = require('./index');
const dotenv = require('dotenv');
const pool = require('./config/db.config');

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});