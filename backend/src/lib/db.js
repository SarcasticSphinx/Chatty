import mongoose from 'mongoose'

async function connectToMongoDB() {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log('mongoDB connected at: ', connect.connection.host)
    } catch (error) {
        console.log('mongoDB error: ', error)
    }
}

export default connectToMongoDB