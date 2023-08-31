const mongoose = require('mongoose')
const { seatSchema, Seat } = require('./seat')
const { Schema } = mongoose;


const busSchema = new Schema({

    from: {
        type: String,
        uppercase: true,
        required: true

    },
    to: {
        type: String,
        uppercase: true,
        required: true
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Your validation logic here
                return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
            },
            message: 'Invalid time format. Time should be in HH:MM format (24-hour).'
        }
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const date = new Date(value)
                const current_date = new Date()
                return !(isNaN(date) || current_date > date)
            },
            message: 'Invalid date'
        }
    },

    busNumber: {
        type: String,
        required: true
    },
    seatPrice: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
});
busSchema.virtual('allSeats', {
    ref: 'Seat',             // Reference the 'Seat' model
    localField: '_id',       // The local field in Bus model
    foreignField: 'bus',     // The corresponding field in Seat model
    justOne: false           // Set to 'false' to get an array of seats
});
//delete all seats attached with it
busSchema.post("findOneAndDelete", async function () {
    console.log('Deleted bus with ID:', this._conditions._id)
    await Seat.deleteMany({ bus: this._conditions._id })

});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
