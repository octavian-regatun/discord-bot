import mongoose from 'mongoose';

export const connectToDB = async (): Promise<void> => {
  // add your own uri below

  if (process.env.DB_USERNAME == undefined) {
    throw new Error('add DB_USERNAME field to .env file');
  }

  if (process.env.DB_PASSWORD == undefined) {
    throw new Error('add DB_PASSWORD field to .env file');
  }

  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@main.1imem.mongodb.net/main?retryWrites=true&w=majority`;

  await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      return console.log(`Connected to DB`);
    })
    .catch((error) => {
      console.log('Error connecting to database: ', error);
      return process.exit(1);
    });
};
