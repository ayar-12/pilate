import mongoose from "mongoose";


const couchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    exp: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    }
})

const userModel = mongoose.model.couch || mongoose.model('couch', couchSchema);


export default userModel;