const express = require("express");
const { errorHandlerMiddleware } = require('./errorHandlerMiddleware.js');
const mockingModule = require('./mockingModule');
const path = require("path");
const cartRouter = require("./routes/cartRouter");
const productRouter = require("./routes/productRouter.js");
const vistaRouter = require("./routes/vistaRouter.js");
const userRouter = require("./routes/usersRouter.js");
const sessionRouter = require("./routes/sessionsRouter.js");
const { isUtf8 } = require("buffer");
const {Server} = require("socket.io");
const http = require("http");
const handlebars = require('express-handlebars');
const swaggerJsdoc = require ('swagger-jsdoc');
const swaggerUiExpress = require ('swagger-ui-express');
const { error } = require("console");
const {default: mongoose} = require("mongoose");
const MongoStore = require("connect-mongo");
require ('dotenv').config();
const session = require("express-session");
const passport = require("passport");
const { initializePassport } = require("./config/passport.config");
const cookieParser = require("cookie-parser"); 
const { Contacts, Users, Carts, Products } = require("./dao/factory");
const logger = require('./config/logger');

const app = express()
const server = http.createServer(app)
const io = new Server(server)
global.io = io;
const port = process.env.PORT||8080;
const connection = mongoose.connect(`mongodb+srv://pablopinto1985:pablo1985@ecommerce.kyhfmlv.mongodb.net/?retryWrites=true&w=majority`)

// Configuración específica para el entorno de desarrollo
if (process.env.NODE_ENV === 'development') {
  // Configuración adicional para el desarrollo
  console.log('Running in development mode');
}

// Configuración específica para el entorno de producción
if (process.env.NODE_ENV === 'production') {
  // Configuración adicional para la producción
  console.log('Running in production mode');
}

const swaggerOptions = {
  definition:{
      openapi:"3.0.1",
      info: {
          title:"Documentacion de API",
          description:"Desafio 10 backend"
  },
  },
  apis:["src/docs/Users.yaml"]
  }
  
  const specs = swaggerJsdoc(swaggerOptions)
  
  app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.get('/mockingproducts', (req, res) => {
  const mockProducts = mockingModule.generateMockProducts();
  res.json(mockProducts);
});
app.listen(port, () => {
  console.log(`Servidor corriendo en el ${port}`);
});

app.get('/loggerTest', (req, res) => {
  logger.log('info', 'Este es un mensaje de nivel info');
  logger.log('warning', 'Este es un mensaje de nivel warning');
  logger.log('error', 'Este es un mensaje de nivel error');
  logger.log('debug', 'Este es un mensaje de nivel debug');
 
  res.status(200).send('Mensajes de prueba registrados');
 });

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(errorHandlerMiddleware);

io.on('connection', (socket) => {
    console.log('Cliente conectado');
  
    socket.emit('conexion-establecida', 'Conexión exitosa con el servidor de Socket.IO');
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
});


app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }, ttl: 3500
}),
    secret: "clavesecreta",
    resave: false,
    saveUninitialized: true
}));



initializePassport();

app.use('/api/users',userRouter);
app.use('/api/sessions',sessionRouter);
app.use(passport.initialize())
app.use(passport.session());
app.use("/", cartRouter);
app.use("/", productRouter); 
app.use("/", vistaRouter)




app.engine("handlebars", handlebars.engine());

app.set("view engine", "handlebars");

app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));
