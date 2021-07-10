require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})