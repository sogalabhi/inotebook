const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook"


async function connectToMongo() {
    mongoose.connect(mongoURI).then(() => console.log("Connected")).catch((e) => console.log(e.message))

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

module.exports = connectToMongo;