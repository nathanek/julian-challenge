import moment from "moment";

export default function DateArrayFormatter(json_data){
      var obj = json_data;
      var start = json_data[0].date;
      //console.log(start);
      var end = new Date();
      var count = 1;
      if (obj.length <=1) {
      } else{
         while (obj[count].date < end) {
            var nextDay = addDays(obj[count-1].date, 1);
            if (+nextDay == +obj[count].date) {
               if (count == obj.length - 1){
                  break;
               }
            } else {
               if (count < obj.length - 1){
                  obj.splice(count,0,{date: nextDay, count: 0});
               } else if (count >= obj.length - 1) {
                  obj.push({date: nextDay, count: 0});
               }

            }
            count++;
            //console.log(count);
            //console.log(JSON.stringify(obj));
         }
      }
      
      console.log('DateArrayFormatter');
      return obj;
}

function addDays(date, days) {
   const copy = new Date(Number(date))
   copy.setDate(date.getDate() + days)
   return copy
 }
 
 const date = new Date();
 const newDate = addDays(date, 10);