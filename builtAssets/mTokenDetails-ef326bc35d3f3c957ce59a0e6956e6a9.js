$(document).ready(function(){var n=document.getElementById("transactionUrl").innerHTML;document.getElementById("transactionTable");$("#test").on("click",function(){console.log("test clicked!")});var t={bLengthChange:!1,searching:!1,processing:!0,serverSide:!0,ajax:{url:n,dataSrc:function(n){return n.data.contract_internal_transactions}},columns:[]};t.columns.unshift({title:"",data:null,render:function(n,t,e,a){return Handlebars.compile($("#token-icon").text())()},width:"16%"},{title:"",data:null,render:function(n,t,e,a){return Handlebars.compile($("#token-amount").text())({tokens:n.hash})},width:"84%"}),$("#tokenDetailsRecentTrans").DataTable(t)});