import express from 'express';
import App from './services/ExpressApp';
import DbConnection from './services/Database';
import { PORT } from './config';
require('dotenv').config();

const StartServer = async () => {
    const app = express();

    await DbConnection();

    await App(app);

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);  
    });
}

StartServer();