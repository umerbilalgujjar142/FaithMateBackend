const app = require('express')();
const db = require('./Model')
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const { authJwt } = require("./Middleware");
const socketIo = require('socket.io');
const http = require('http');
const { initSocket } = require('./Helper/Helper.js');
const server = http.createServer(app);
const io = socketIo(server);






app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


db.sequelize.sync({alter: true})

initSocket(io);




require('./Routes/user.route')(app);



// access token is required to access these routes with parameter x-access-token in header
app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});



app.use([authJwt.verifyToken]);
require('./Routes/personality.route')(app);
require('./Routes/hobbies.route')(app);
require('./Routes/profile.route')(app);
require('./Routes/resetpassword.route')(app);
require('./Routes/bestmatch.route')(app);
require('./Routes/chat.route')(app);
require('./Routes/subscription.route')(app);




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}
);