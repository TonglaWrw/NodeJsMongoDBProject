let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser')
let dbConfig = require('./database/db')

// Express Route
const supplierRoute = require('./routes/supplier.route')

// Connecting MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true
}).then(() => {
  console.log('Database connected')
},
  error => {
    console.log('Could not connect database: ' + error)
  }
)
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors());
app.use('/supplier', supplierRoute)

// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port '+ port)
})

// ERROR 404
// app.use((req, res, next) => {
//   next(createError(404));
// });

// Error handler
app.use(function(err, req, res, next) {
  console.log(err.message);
  if(!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
})