const mongoose = require('mongoose');
const { Schema } = mongoose;
const seatSchema = new Schema({
    seatNumber: {
        type: String,
        required: true,
    },
    isReserved: {
        type: Boolean,
        default: false,
    },
    isBooked:{
        type:Boolean,
        default: false,
    },
    seatToken: {
        type: String,
        default:null,
       
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Replace with the actual User model
        default: null,
    },
    bus:{
        type:Schema.Types.ObjectId,
        ref:'Bus'
    },
    reservedAt:{
        type:Date,
        default:null
    }
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = {
    seatSchema,
    Seat,
};
