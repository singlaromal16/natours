const mongoose = require('mongoose');
const dotenv = require('dotenv'); // fetch env variable from config file

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION !!!');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

console.log(process.env.NODE_ENV);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  // console.log(con.connections);
  console.log('DB connected');
});
// .catch((err) => console.log('ERROR ==== '));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log('App is running on port', PORT);
});

// Unhandled promise Rejection - Async func errors
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION !!!');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    consoel.log('Process terminated');
  });
});
