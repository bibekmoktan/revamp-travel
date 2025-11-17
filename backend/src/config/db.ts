import mongoose from "mongoose";

// Can be kept in another file as a constant 
const DB_NAME = ""

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log('MongoDB connected successfully. DB Host : ', connectionInstance.connection.host)
    } catch (error) {
        console.log("MongoDB connection Error : ", error)
    }
}

export {connectDB}