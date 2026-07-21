import mongoose from "mongoose";

//mongo DB configure
export const connectDB = () => {
    mongoose.connect(process.env.DB_URL)
        .then((data) => { console.log("MongoDB connected with server: ", data.connection.host) })
        .catch((err) => { console.log(err.message) })
}

