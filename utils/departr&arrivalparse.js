const Bus = require('../model/busses')
module.exports = async()=>{
    const allBuses = await Bus.find({})

    var bus_from = Array.from(new Set(allBuses.map((bus)=>bus.from)))
    var bus_to = Array.from(new Set(allBuses.map((bus)=>bus.to)))
    return {bus_from, bus_to}
}