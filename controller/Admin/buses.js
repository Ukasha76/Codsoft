const Bus = require('../../model/busses')
const { Seat } = require('../../model/seat')
const AppError = require('../../utils/AppError')
const flashError = require('../../utils/flashError')
const { formatSeats } = require('../../utils/formatSeats')
const getdeptarrival = require('../../utils/departr&arrivalparse')

const getaddBus = (req, res) => {
    res.render('Admin/Busses/addbus', { tittle: 'Add Bus' })
}

const postaddBus = async (req, res, next) => {

    const seats = formatSeats(req.body.totalSeats)

    const bus = new Bus(req.body)

    const insertPromises = seats.map(async s => {
        const seat = new Seat({
            ...s,
            bus: bus._id
        });
        await seat.save();
        return seat;
    })
    const insertedSeats = await Promise.all(insertPromises);
    const savedBus = await bus.save()
    req.flash('success', 'Bus Added successfully')
    res.redirect('/admin/home')

}



const searchBus = async (req, res) => {


    const { bus_from, bus_to } = await getdeptarrival()


    res.render('Admin/Busses/searchbus', { bus_from, bus_to, Busses: [], tittle: 'Search Bus' })
}

const showBus = async (req, res, next) => {


    if (req.body.from === '' || req.body.to === '' || req.body.date === '') throw new AppError('Invalid Entries', 404)//SERVER SIDE VALIDATION

    const Busses = await Bus.find({ from: req.body.from, to: req.body.to, date: req.body.date });

    if (!Busses.length) throw new flashError(`WOOPS! No Bus from ${req.body.from} to ${req.body.to} on ${req.body.date}!!!`);

    const { bus_from, bus_to } = await getdeptarrival()


    if (!Busses.length) {
        throw new flashError('No bus found')
    }



    res.render('Admin/Busses/searchbus', { bus_from, bus_to, Busses, tittle: 'Available Busses' })
}


const getsearchforedit = async (req, res) => {

    const { bus_from, bus_to } = await getdeptarrival()


    res.render('Admin/Busses/searchforedit', { bus_from, bus_to, bus: null, tittle: 'Search Bus ' })
}

const searchforedit = async (req, res, next) => {

    if (req.body.from === '' || req.body.to === '' || req.body.date === '' || req.body.time === '') throw new AppError('Invalid Entries', 404)//SERVER SIDE VALIDATION

    const bus = await Bus.findOne(req.body);
    if (!bus) throw new flashError(`WOOPS! No Bus from ${req.body.from} to ${req.body.to} on ${req.body.date}!!!`)

    const { bus_from, bus_to } = await getdeptarrival()

    res.render('Admin/Busses/searchforedit', { bus_from, bus_to, bus, tittle: 'Bus found' })
}

const geteditBus = async (req, res, next) => {
    const { id } = req.params

    const bus = await Bus.findById(id)

    if (!bus) throw new AppError('Bus not found!', 404)

    res.render('Admin/Busses/editbus', { bus, tittle: 'Edit Bus' })


}

const posteditBus = async (req, res, next) => {

    const allowed = ['to', 'from', 'time', 'date', 'busNumber', 'seatPrice']

    const updates = Object.keys(req.body)

    const isAllowed = updates.every((update) => allowed.includes(update))

    if (!isAllowed) throw new AppError('Invalid Updates!', 400)

    const { id } = req.params

    const bus = await Bus.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })

    if (!bus) throw new AppError('Bus not found!', 404)

    req.flash('success', 'Bus edited successfully')
    res.redirect('/admin/home')
}


const getsearchfordrop = async (req, res) => {
    const { bus_from, bus_to } = await getdeptarrival()


    res.render('Admin/Busses/searchtodrop', { bus_from, bus_to, bus: null, tittle: 'Search to Drop' })
}
const searchfordrop = async (req, res, next) => {

    if (req.body.from === '' || req.body.to === '' || req.body.date === '' || req.body.time === '') throw new AppError('Invalid Entries', 404)//SERVER SIDE VALIDATION
    const bus = await Bus.findOne(req.body);
    if (!bus) throw new flashError(`WOOPS! No Bus from ${req.body.from} to ${req.body.to} on ${req.body.date}!!!`)

    const { bus_from, bus_to } = await getdeptarrival()


    res.render('Admin/Busses/searchtodrop', { bus_from, bus_to, bus, tittle: 'Drop bus' })

}

const dropBus = async (req, res, next) => {
    const { id } = req.params
    const bus = await Bus.findByIdAndDelete(id)
    if (!bus) throw new flashError(`WOOPS! No Bus from ${req.body.from} to ${req.body.to} on ${req.body.date}!!!`)
    req.flash('success', 'Bus dropped successfully')
    res.redirect('/admin/home')
}

const getsearchfordetail = async (req, res) => {
    const { bus_from, bus_to } = await getdeptarrival()

    res.render('Admin/Busses/searchbusdirectly', { bus_from, bus_to, bus: null, tittle: 'Search Bus' })

}
const searchfordetail = async (req, res, next) => {
    if (req.body.from === '' || req.body.to === '' || req.body.date === '' || req.body.time === '') throw new AppError('Invalid Entries', 404)//SERVER SIDE VALIDATION
    const bus = await Bus.findOne(req.body).populate('allSeats')
    if (!bus) throw new flashError(`WOOPS! No Bus from ${req.body.from} to ${req.body.to} on ${req.body.date}!!!`)
    const seats = bus.allSeats
    const { bus_from, bus_to } = await getdeptarrival()

    seats.sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber));

    res.render('Admin/Busses/searchbusdirectly', { bus_from, bus_to, bus, seats, tittle: 'Bus Details' })

}

const getBus = async (req, res, next) => {
    const { id } = req.params

    const bus = await Bus.findById(id).populate('allSeats')

    if (!bus) throw new AppError('Bus Not found!', 404)

    const seats = bus.allSeats

    seats.sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber));

    res.render('Admin/Busses/showBus', { bus, seats, tittle: 'Bus details' })

}


const showstatisticform = async (req, res) => {

    const { bus_from, bus_to } = await getdeptarrival()

    res.render('Admin/Busses/searchStat', { bus_from, bus_to, bus: null, tittle: 'Bus Statistics' })
}

const showstatistic = async (req, res, next) => {
    if (req.body.from === '' || req.body.to === '' || req.body.date === '' || req.body.time === '') throw new AppError('Invalid Entries', 404)//SERVER SIDE VALIDATION
    const bus = await Bus.findOne(req.body).populate('allSeats')
    if (!bus) throw new flashError(`WOOPS! No Bus from ${req.body.from} to ${req.body.to} on ${req.body.date}!!!`)

    
    const seats = bus.allSeats

    const bookedcount = seats.filter(obj=>obj.isBooked===true).length

    const reservedcount = seats.filter(obj => obj.isReserved === true).length - bookedcount
    const empty = bus.totalSeats - reservedcount
    const revenue = (bus.seatPrice)*bookedcount
    const obj = {
        reservedcount,
        empty,
        bookedcount,
        revenue
        
    }
    const { bus_from, bus_to } = await getdeptarrival()

    res.render('Admin/Busses/searchStat', { bus_from, bus_to, obj, bus, tittle: 'Bus Statistic' })
}


module.exports = {



    getaddBus,
    postaddBus,

    searchBus,
    showBus,

    getsearchforedit,
    searchforedit,

    geteditBus,
    posteditBus,

    getsearchfordrop,
    searchfordrop,
    dropBus,

    getsearchfordetail,
    searchfordetail,

    getBus,

    showstatisticform,
    showstatistic
}