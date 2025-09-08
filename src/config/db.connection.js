import 'dotenv/config';
import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    process.exit(1);
  }
};

export default connectDB;