const app = require('./src/app');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  process.stdout.write(`Listening: http://localhost:${port}\n`);
});

module.exports = app;
