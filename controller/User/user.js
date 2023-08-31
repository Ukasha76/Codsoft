const User = require('../../model/user')
const Bus = require('../../model/busses')
const { formatDateTime, formatdate } = require('../../utils/formatdate')
const AppError = require('../../utils/AppError')
const { Seat } = require('../../model/seat')
const flashError = require('../../utils/flashError')
const { formatforclient, foramtforserver } = require('../../utils/formatclientdate')
const uuid  = require('uuid')
const PDFDocument = require('pdfkit');



const searchBus = async (req, res) => {
  const allBuses = await Bus.find({})

  var bus_from = Array.from(new Set(allBuses.map((bus) => bus.from)))
  var bus_to = Array.from(new Set(allBuses.map((bus) => bus.to)))

  const dates = formatforclient()

  res.render('user/Buses/searchBus', { dates, bus_from, bus_to, Busses: [], tittle: 'Search Bus' })
}

const showBus = async (req, res, next) => {
  
  req.body.date = foramtforserver(req.body.date)
  
 
  const fetchBusesByRoute = Bus.find({ from: req.body.from, to: req.body.to, date: req.body.date });
  const fetchAllBuses = Bus.find({});
  
  const [Busses, allBuses] = await Promise.all([fetchBusesByRoute, fetchAllBuses]);
  

  var bus_from = Array.from(new Set(allBuses.map((bus) => bus.from)))
  var bus_to = Array.from(new Set(allBuses.map((bus) => bus.to)))

  if (!Busses.length) {
    throw new flashError('No bus found')
  }

  const dates = formatforclient()

  res.render('user/Buses/searchBus', { dates, bus_from, bus_to, Busses, tittle: 'Busses' })

}

const showseats = async (req, res, next) => {

  const { id } = req.params
  const bus = await Bus.findById(id).populate('allSeats')

  if (!bus) {
    throw new AppError('Bus not found', 404)
  }


  const seats = bus.allSeats


  seats.sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber));

  res.render('user/Buses/showseats', { bus, seats, tittle: 'Seats' })

}

const bookseat = async (req, res, next) => {


  const { id } = req.params

  const seat = await Seat.findById(id)

  const userCount = await Seat.countDocuments({ user: req.user._id })

  if (seat.isReserved) {
    throw new flashError('Seat is already reserved ')
  }

  if (userCount >= 3) {
    throw new flashError('You booking limit of 3 has been reached')
  }

  seat.isReserved = !seat.isReserved

  seat.user = req.user._id

  seat.seatToken = uuid.v4(), 
  // Generate a UUID for each new seat

  seat.reservedAt = new Date()

  await seat.save()

  req.flash('success', 'Seat has been Reserved successfully')

  const path = req.path
 
  res.redirect(`/payment/${id}?path=${encodeURIComponent(path)}`);




}


const mytickets = async (req, res, next) => {

  const tickets = await Seat.find({ user: req.user._id, isBooked:false })
  .populate('bus')
  .populate('user')

  if (!tickets.length || tickets[0].bus === null) {
    throw new AppError('NO ticket found', 404)
  }

  const dates = tickets.map(obj => formatDateTime(obj.reservedAt))
  const path = req.path

  res.render('user/Buses/mytickets', { tickets, dates, tittle: 'My Tickets' ,path })


}


const writeSeatToken = async (req, res, next) => {
  res.render('user/Buses/writeSeatToken',{tittle:'Book Ticket'})
}
const bookSeatbyToken = async (req, res, next) => {

  const seatToken = req.body.token
 
  const seat = await Seat.findOne({ seatToken: seatToken });


  //check if seat is reserved and not booked 
  if (seat.isReserved === true && seat.isBooked === true) {

    throw new flashError('Seat is Already Booked!')
    
   
  }
  else if (seat.isReserved === true && seat.isBooked === false) {
  
    const {_id} = seat
    const path = req.path
   
      res.redirect(`/payment/${_id}?path=${encodeURIComponent(path)}`);
   
    

  }else{

    throw new flashError('Please reserve the seat first!')


  }


}
const bookedtickets = async(req,res,next)=>{
  
  const tickets = await Seat.find({ user: req.user._id , isBooked:true}).populate('bus').populate('user')

  if (!tickets.length || tickets[0].bus === null) {
    throw new AppError('NO ticket found', 404)
  }
  const path = req.path

  const dates = tickets.map(obj => formatDateTime(obj.reservedAt))

  res.render('user/Buses/mytickets', { tickets, dates, tittle: 'My Tickets' ,path})


}

const downloadPDF = async (req,res,next)=>{
  const { id } = req.params
  const ticket = await Seat.findById(id).populate('bus').populate('user');
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ticket_${id}.pdf`);
  doc.pipe(res);
  doc.fontSize(14).text(`Ticket ID: ${ticket._id}`, 100, 100);
  // doc.fontSize(14).text(`Ticket ID: ${ticket._id}`, 100, 100);
  doc.fontSize(14).text(`Seat Number: ${ticket.seatNumber}`);
  doc.fontSize(14).text(`Name: ${ticket.user.username}`);
  doc.fontSize(14).text(`Route: ${ticket.bus.from} to ${ticket.bus.to}`);
  doc.fontSize(14).text(`Departure: ${ticket.bus.date} at ${ticket.bus.time}`);
  // doc.fontSize(14).text(`Reserved At: ${dates[i].fulldate} ON ${dates[i].time}`);
  doc.fontSize(14).text(`Seat Token: ${ticket.seatToken}`);  // doc.fontSize(14).text(`Route: ${ticket.from}`, 100, 100);
  doc.end();
}
module.exports = {
  searchBus,
  showBus,
  showseats,
  bookseat,
  mytickets,
  writeSeatToken,
  bookSeatbyToken,
  bookedtickets,
  downloadPDF
}



