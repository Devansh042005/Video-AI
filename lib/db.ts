// database connections

import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI! 

if(!MONGODB_URI){
    throw new Error("Please define mongo_uri in env variables");
}

// cached variable will maintain the connection. agr already connection hai to vhi wala use kr lenge .. agr ni h to new banyenge
let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn: null, promise: null}
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){

        mongoose
        .connect(MONGODB_URI)
        .then(() => mongoose.connection)

    }

    try{
        cached.conn = await cached.promise // waiting for cached.promise . after getting store it in the cached.conn
    } catch(error){
        cached.promise = null
        throw error
    }
    return cached.conn
}