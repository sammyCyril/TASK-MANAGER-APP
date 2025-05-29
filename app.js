const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
   
dotenv.config(); 
const app = express();  

app.use(bodyParser.json());

const connect = async () => { 
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to mongoDB.");
    } catch (error) {
      throw error;
    }
  }; 

   mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!"); 
  });

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); 

app.listen(3000, () => {
    connect()
    console.log("Server is running on port 3000");
});