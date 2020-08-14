const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@main.1imem.mongodb.net/main?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log('DB Connected!');
  } catch (error) {
    console.log(`DB Connection Error: ${error.message}`);
    handleError(error);
  }
})();

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);
