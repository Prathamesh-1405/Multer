import mongoose from "mongoose";

type connection = {
  isConnected?: boolean;
};

const connObject: connection = {};
const connectDB = async () => {
  console.log(`REACHED HERE`);
  
  if (connObject.isConnected) {
    console.log("database already connected!!!");
    return;
  }

  try {
    
    console.log(process.env.DB_CONNECT_URL);
    const url: string=`${process.env.DB_CONNECT_URL}/${process.env.DATABASE_NAME}`
    const dbConnectionResponse = await mongoose.connect(url);

    
    if (dbConnectionResponse.connection.readyState === 1) {
      connObject.isConnected = true;
    }

    console.log("DB Connected Successfully");
    return;
  } catch (error) {
    console.error(`failed to connect db ${error}`);
    process.exit(1);
  }
};

export default connectDB;