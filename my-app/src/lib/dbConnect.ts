import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }
    try {
        console.log("Connecting to MongoDB URI:", process.env.MONGODB_URI?.substring(0, 30) + "...");
        const db = await mongoose.connect(process.env.MONGODB_URI || '')

        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected Successfully. Database name:", db.connections[0].name);
    } catch (error) {
        console.log("Database connection failed", error);
    }
}

export default dbConnect;