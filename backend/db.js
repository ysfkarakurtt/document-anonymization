import mongoose from "mongoose";

const conn = () => {
    mongoose.connect(process.env.DB_URL, {
        dbName: 'document-anonymization',
    }).then(() => {
        console.log("Connected to DB successful")
    }).catch((err) => {
        console.log(`DB connection err: ${err}`)
    }
    )
}

export default conn;