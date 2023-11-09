import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

//controllers
import storeDataFromUrls from './controllers/storeDataFromUrl.js';
import queryIndex from './controllers/queryIndex.js';
import deleteDocs from './controllers/deleteDocs.js';
import summariseContent from './controllers/summariseContent.js';


const app = express();

app.use(cors());
app.use(express.json());


app.get('/api', (req, res) => {
    res.send('Hello World!')
});


//routes
app.post('/api/storeDataFromUrls', storeDataFromUrls);
app.post('/api/queryIndex', queryIndex);
app.post('/api/deleteDocs', deleteDocs);
app.post('/api/summariseContent', summariseContent);


app.use((err, req, res, next) => {
    console.log('From global error handler');
    console.log(err);
    res.status(500).json({ message: "An error occurred. Please try again." });
});


app.listen(7777, () => {
    console.log('Server listening on port 7777');
});
