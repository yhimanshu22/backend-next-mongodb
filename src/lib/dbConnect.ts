import mongoose from 'mongoose';

type ConnectionObject = {
    isconnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    // check it is connected or not ----- 
    if (connection.isconnected) {
        console.log('Already connected to database')
    }
    // if not connected then connect it here -------
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '', {})

        connection.isconnected = db.connections[0].readyState

        console.log('DB connected successfully')


    } catch (error) {
        // checking what is error --
        console.log('DB connection failed', error)

        // it is necessary to exit
        process.exit()

    }
}