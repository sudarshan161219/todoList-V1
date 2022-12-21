


exports.getDate  = function (){
  
    const today = new Date();

    const options = {
       weekday: "long",
       day: "numeric",
       month: "long",
   }
    const day = today.toLocaleDateString("en-Us", options) 

return day

}




exports.getTime  = function(){
  const today = new Date();
 const time = today.getHours() +':' + String(today.getMinutes()).padStart(2, "0")+':'+ String( today.getSeconds()).padStart(2, "0")
return time
}
