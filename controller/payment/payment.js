
const { Seat } = require('../../model/seat')
const { formatDateTime, formatdate } = require('../../utils/formatdate')

const stripe = require('stripe')( process.env.SECRET_KEY)

const renderBuyPage = async (req, res, next) => {
    
    const {id }= req.params
    const Path = req.query.path

    const ticket = await Seat.findOne({ _id: id }).populate('bus').populate('user')

    const date = formatDateTime(ticket.reservedAt)
    const amount = parseInt(ticket.bus.seatPrice) * 100

 
    res.render('payment/buyPage', {
        key:    process.env.PUBLISHABLE_KEY,
        amount: amount,
        ticket,
        date,
        tittle: 'Check OUT',
        Path

    })


}
const payment = async (req, res, next) => {
    const { id } = req.params

    const customer = await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: req.body.username,

    })

    const charge = await stripe.charges.create({
        amount: req.body.amount,
        description: 'Seat Booking',
        currency: 'PKR',
        customer: customer.id
    })

    const seat =   await Seat.findOne({ _id: req.body.ticketId }).populate('bus').populate('user')
    seat.isBooked = true
    await seat.save()
    
    if(req.body.Path==='/bookTicket'){
        req.flash('success', 'Seat has Booked Successfully')
        res.redirect('/user/home')
    }
    res.redirect(`/user/bookseat/${id}`)




}

module.exports = {
    renderBuyPage,
    payment,

}