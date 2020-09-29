const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

//Root
app.get('/', (req, res) => {
  res.render('index.ejs');
});


//Setup Server listen
app.listen(port, () => {
  console.log(`Site listening at http://localhost:${port}`);
});

