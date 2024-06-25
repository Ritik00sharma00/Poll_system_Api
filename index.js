const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 17403;  
const router=require('../Backend/Routes/route');



app.use(bodyParser.json());


app.use('/',router);

app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});
