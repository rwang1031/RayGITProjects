///<reference path="jquery-1.10.2.js" />
///<reference path="jquery.dataTables.js" />
///<reference path="~/Site.Master">

$(function () {
    
    var odataTable;
    var g_orderDataTable;   
    getCustomerData();
    getOrderDataByCustomerID("100000");
    $('#button_add_customer').click(add_customer_button_clickhandler);
    set_table_tittle();

});

function getCustomerData() {
    //alert("gg");
    $.ajax({
        type: "post",
        url: "WebService.asmx/Get_Customers",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: buildMyDatatable,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    });
}

function getOrderDataByCustomerID(customer_id) {
    $.ajax({
        type: "post",
        url: "WebService.asmx/Get_Orders_By_CustomerID",
        data: "{'customer_id':"+customer_id+"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: buildOrderDatatable,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    });             
}


function buildMyDatatable(result) { 
    if (result.hasOwnProperty("d")) {
        result = result.d;
    }
    var data = JSON.parse(result);
   // var data = result;

    odataTable = $('#table_customer').dataTable({
        "bRetrieve": true,
        "bDestroy": true,
        "bPaginate": true,
        "bAutoWidth": false,
        "iDisplayLength": 5,
        "sPaginationType": "full_numbers",
        "bJQueryUI": false,
        "sDom": '<"top"fr>t<"bottom"p><"clear">',
        //"fnRowCallback": customFnRowCallback,            
        "aaData": data,
        //"sAjaxSource": "WebService.asmx/Get_Customers",
        "aoColumns": [
            { "sTitle": "ID" },
            { "sTitle": "Name", "sWidth": "30px" },
            { "sTitle": "Address", "sWidth": "30px" },
            { "sTitle": "Phone", "sWidth": "30px" }
        ],
        "fnInitComplete": initCompleteHandler_Customer
    });
}

  function buildOrderDatatable(result) {
     if (result.hasOwnProperty("d")) {
        result = result.d;
    }
       
    var data = JSON.parse(result);
    // var data = result;
    g_orderDataTable = $('#table_order').dataTable({
        "bRetrieve": true,
        "bDestroy": true,
        "bPaginate": true,
        "bAutoWidth": false,
        "iDisplayLength": 5,
        "sPaginationType": "full_numbers",
        "bJQueryUI": false,
        "sDom": '<"top"fr>t<"bottom"p><"clear">',
        //"fnRowCallback": customFnRowCallback,            
        "aaData": data,
        //"sAjaxSource": "WebService.asmx/Get_Customers",
        "aoColumns": [
            { "sTitle": "Order ID" },
            { "sTitle": "Customer ID","bVisible":false },
            { "sTitle": "Customer Name", "sWidth": "20px" },
            { "sTitle": "Item ID", "bVisible": false},
            { "sTitle": "SN", "sWidth": "20px" },
            { "sTitle": "Item Name", "sWidth": "20px" },
            { "sTitle": "Price", "bVisible": false },
            { "sTitle": "Date", "sWidth": "20px" },
            { "sTitle": "Provider", "bVisible": false }
        ],
        "fnInitComplete": initCompleteHandler_Order
    });
}



function reGetCustomerData(result) {
    if (onSuccessCallback != undefined)
        onSuccessCallback(result);
    $.ajax({
        type: "post",
        url: "WebService.asmx/Get_Customers",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ReGainData,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    });
}

function ReGainData(result) {
    if (result.hasOwnProperty("d")) {
        result = result.d;
    }
    var data = JSON.parse(result);
    odataTable.fnAddData(data);
    //after regenerating the table,add handlers to it. 
    reloadCompleteHandler();
}

 function add_customer_button_clickhandler(e) {
     odataTable.fnClearTable();
     var fname = $('#tb_customer_firstname').val();
     var lname = $('#tb_customer_lastname').val();
     var phone = $('#tb_customer_phone').val();
     var address = $('#tb_customer_address').val();
     addCustomer(fname, lname, phone, address, onSuccess);     
 }

 function initCompleteHandler_Customer() {
   $("#table_customer_wrapper").find(".top").append('<label class="table_title">Customer Information</label>');
   tableEventsConfiguration("table_customer");      
 }

 function initCompleteHandler_Order() {
   $("#table_order_wrapper").find(".top").append('<label class="table_title">Order Information</label>');
   tableEventsConfiguration("table_order");      
 }



 function reloadCompleteHandler(){
  tableEventsConfiguration("table_customer"); 
 }


  function tableEventsConfiguration(tableId){
     $('#'+tableId+' tbody tr').hover(function(e){
      //mouseenter
      if(!$(this).hasClass('selected_row'))
      {$(this).addClass('mouseover_row');}

      },function(e){
      //mouseleave
      $(this).removeClass('mouseover_row');    
      });

     $('#'+tableId+' tbody tr').click(function(){
       $(this).addClass('selected_row');
       $(this).siblings().removeClass('selected_row');   
     });

}

function addCustomer(firstname, lastname, phone, address,onSuccessCallback) {
    
    $.ajax({
        type: "post",
        url: "WebService.asmx/Add_Customer",
        data: "{'first_name':'" + firstname + "','last_name':'" + lastname +
        "','phone':'" + phone + "','address':'" + address + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
            if (onSuccessCallback != undefined)
                onSuccessCallback(result);
            $.ajax({
                type: "post",
                url: "WebService.asmx/Get_Customers",
                data: {},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: ReGainData,
                error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
            });
        },
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    })
  
}

function onSuccess(data) {
    alert(data);
}

