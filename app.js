const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const checkAuth = require('./middleware/checkForAuth');
require('dotenv').config();

const app = express();


//  Middleware Setup
app.use(cookieParser());
app.use(checkAuth);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

//  Setup handlebars view engine
app.use(express.static('public'))
app.engine('hbs', exphbs({
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: __dirname + '/views/layouts',
    partialsDir  : [
        //  path to your partials -- partials wouldn't render without this 
        __dirname + '/views/partials',
    ]
}));
app.set('view engine', 'hbs');

// Database Connections
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/gig-buddy', { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error'));
mongoose.Promise = global.Promise;

//  Setup Controllers 
require('./controllers/index')(app);
require('./controllers/clients')(app);
require('./controllers/services')(app);
require('./controllers/auth')(app);
// require('./controllers/user')(app);


//  App running locally on localhost:3000
app.listen(3000, () => console.log('App runnin on 3000'));


module.exports = app;