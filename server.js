const express = require('express');
const app = express();
app.use(express.static('.'));
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => console.log('Medical App is live!'));
