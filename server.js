const app = require('./src/app');
const model = require('./src/models/index');

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  process.stdout.write('Server is listening\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  process.stdout.write('Closing http server\n');
  server.close(() => {
    model.close();
    process.exit(0);
  });
});

module.exports = app;
