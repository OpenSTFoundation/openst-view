$(document).ready(function(){var t=document.getElementById("transactionUrl").innerHTML;document.getElementById("transactionTable");$("#test").on("click",function(){console.log("test clicked!")});var n={bLengthChange:!1,searching:!1,processing:!0,serverSide:!0,ajax:{url:t,dataSrc:function(t){return t.data.contract_internal_transactions}},columns:[]};n.columns.unshift({title:"",data:null,render:function(t,n,a,e){return'<img src="https://dummyimage.com/400x400/22aaee/fff.png" class="tokenIcon" /><span class="address_title_color ">'+t.id+"</span>"},width:"16%",class:"aniket"},{title:"",data:null,render:function(t,n,a,e){return'<span class="address_title_color"> TX#</span> <span class="default_bright_blue">'+t.tokens+"</span>"},width:"16%"},{title:"",data:null,render:function(t,n,a,e){return'<div class="tableBorderRight"> <img src="https://dummyimage.com/400x400/22aaee/fff.png" class="tokenIcon" /> <span class="">'+t.timestamp+"</span> </div>"},width:"16%"},{title:"",data:null,render:function(t,n,a,e){return'<span class="address_title_color"> TX#</span> <span class="default_bright_blue">'+t.tokens+"</span>"},width:"16%"},{title:"",data:null,render:function(t,n,a,e){return'<span class="address_title_color"> TX#</span> <span class="default_bright_blue">'+t.tokens+"</span>"},width:"16%"},{title:"",data:null,render:function(t,n,a,e){return'<span class="address_title_color"> TX#</span> <span class="default_bright_blue">'+t.tokens+"</span>"},width:"4%"},{title:"",data:null,render:function(t,n,a,e){return'<span class="address_title_color"> TX#</span> <span class="default_bright_blue">'+t.tokens+"</span>"},width:"16%"}),$("#tokenDetailsRecentTrans").DataTable(n)});