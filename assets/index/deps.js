const deps = {
    fancyDate(date) {
        let d = new Date(date).getTime(),
            diff = new Date().getTime() - d,
            day = new Date(date).getDay(),
            dateInMonth = new Date(date).getDate(),
            month = new Date(date).getMonth(),
            year = new Date(date).getFullYear(),
            out = "";
    
        day = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ][day];
    
        month = [
            "January",
            "Februar",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ][month];
    
        if (diff < 86400000) {
            if (diff < 3600000) {
                if (diff < 60000) {
                    out = "Few seconds ago";
                } else {
                    out = Math.floor(diff/60000)+" minutes ago";
                }
            } else {
                out = Math.floor(diff/3600000)+" hour"+(Math.floor(diff/3600000) > 1 ? "s" : "")+" ago";
            }
        } else if (diff < 172800000) {
            out = "Yesterday";
        } else if (diff < 604800000) {
            out = upCase(day);
        } else {
            out = day+" "+dateInMonth+" "+month+" "+year;
        }
    
        return out;
    }
};