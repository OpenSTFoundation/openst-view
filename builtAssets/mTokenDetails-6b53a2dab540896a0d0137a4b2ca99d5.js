$(document).ready(function(){var t=document.getElementById("transactionUrl").innerHTML;document.getElementById("transactionTable");$("#test").on("click",function(){console.log("test clicked!")}),$("#tokenDetailsRecentTrans").DataTable({processing:!0,serverSide:!0,ajax:t,columns:[{data:"id"},{data:"hash"},{data:"t_from"},{data:"t_to"},{data:"tokens"},{data:"timestamp"}]})});