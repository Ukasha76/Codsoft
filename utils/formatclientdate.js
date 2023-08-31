const formatforclient= () => {

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const nextsevendaysDate = []
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today)
        nextDate.setDate(nextDate.getDate() + i)
        const dateString = daysOfWeek[nextDate.getDay()] + ' '+ nextDate.getDate() + ',' + nextDate.getFullYear();
        nextsevendaysDate.push(dateString)
    }
    return nextsevendaysDate
}

const foramtforserver = (date1)=>{
 
    const dayName = date1.split(' ')[0]
    const year =date1.split(',')[1].split(' ')[0]
    const date = date1.split(' ')[1].split(',')[0]

    const dayMap = {
        'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
    };
    
    // Mapping of month abbreviations to numerical values
    const monthMap = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    
    // Get the day of the week and month numbers
    const dayOfWeek = dayMap[dayName];
    let month = monthMap["Jan"]; // Placeholder for now
    
    // Find the month based on the day of the week and date
    for (let m = 1; m <= 12; m++) {
        if (new Date(year, m - 1, date).getDay() === dayOfWeek) {
            month = m;
            break;
        }
    }
    return year+'-'+String(month).padStart('2',0)+'-'+date.padStart('2',0)
    // console.log(String(month).padStart('2',0)); // Outputs the numerical value of the month
    
    }
module.exports = {
    foramtforserver,
    formatforclient
}