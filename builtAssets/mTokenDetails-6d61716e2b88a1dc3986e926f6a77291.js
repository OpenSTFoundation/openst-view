$(document).ready(function(){var t=document.getElementById("transactionUrl").innerHTML,a=document.getElementById("transactionTable");$("#test").on("click",function(){console.log("test clicked!")}),$("#tokenDetailsRecentTrans").DataTable({ajax:t,columns:[{data:"name"},{data:"position"},{data:"office"},{data:"extn"},{data:"start_date"},{data:"salary"}]}),$.ajax({url:t,contentType:"application/json",type:"GET",success:function(t,n){console.log("success",t),a.innerHTML=t},error:function(t,a,n){console.log("Error Data: "+t+"\nStatus: "+a)}})});