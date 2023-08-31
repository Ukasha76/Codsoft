const formatSeats = (totalSeats)=>{
    var seats=[]
    var j=1
  for(i =0;i<totalSeats;i++){
    seats[i]={seatNumber:`${j}`}
    j++
  }
  return seats
}
module.exports =
{
    formatSeats
}
