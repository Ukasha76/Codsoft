
const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date)) {
        throw new Error('Date is Invalid');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const fulldate = `${year}-${month}-${day}`
    const time =  `${hours}:${minutes}:${seconds}`

    return obj={fulldate,time}
}


const formatdate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date)) {
        throw new Error('Date is Invalid');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const fulldate = `${day}-${month}-${year}`


    return fulldate
};
module.exports ={
     formatDateTime,
    formatdate
}
