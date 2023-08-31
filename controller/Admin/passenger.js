const User = require('../../model/user')
const {Seat} = require('../../model/seat')
const Bus = require('../../model/busses')
const AppError = require('../../utils/AppError')
const {formatDateTime}  = require('../../utils/formatdate')
const getdeprtorarrivalloction = require('../../utils/departr&arrivalparse')

const pasengerDetail =async (req,res,next)=>{
  
    const { id } = req.params

    const seats = await Seat.findOne({user:id}).populate('bus').populate('user')

    if(!seats)throw new AppError('Passenger details not found!',404)

    const user = seats.user
    
    const bus = seats.bus
    
//   res.send(formatdate(seats.reservedAt))
     const reservedAt =  formatDateTime(seats.reservedAt)
    
    res.render('Admin/passenger/detail',{seats,user,bus,reservedAt,tittle:'Passenger Details'})


}

const searchbus = async(req,res,next)=>{
    const { bus_from , bus_to} = await getdeprtorarrivalloction()
   
    res.render('Admin/passenger/searchbus',{bus_from,bus_to,tittle:'Search Bus'})
}
const showPassengers = async(req,res,next)=>{

    if (req.body.from === '' || req.body.to === '' || req.body.date === '' || req.body.time === '') throw new AppError('Invalid Entries', 404)//SERVER SIDE VALIDATION
    const bus = await Bus.findOne(req.body).populate('allSeats')
    if (!bus) throw new flashError(`WOOPS! No Bus from ${req.body.from} to ${req.body.to} on ${req.body.date}!!!`)

    const seats = bus.allSeats

    // const { bus_from, bus_to } = await getdeptarrival()

    seats.sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber));

    res.render('Admin/passenger/showpassenger',{bus,seats,tittle:'Seats Detail'})
}
module.exports = {
    pasengerDetail,
    searchbus,
   showPassengers 
}