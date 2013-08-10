///<reference path="~/Datatables/js/jquery-1.10.2.js" />
///<reference path="~/Datatables/js/jquery.dataTables.js" />
///<reference path="~/Datatables/js/MyTableApis.js">
///<reference path="~/Datatables/js/addrows.js">
///<reference path="~/Datatables/js/add_customer_validation.js">
///<reference path="~/Site.Master">
 
var _odataCustomerTable;
var _odataOrderTable;
var _oCustomerData;
var _oOrderData;
var _customer_new_id;
var _order_new_id;
 
$(function () {
    getCustomerData();
    getOrderDataByCustomerID("100000");
    $('#button_add_customer').unbind('click').click(add_customer_button_clickhandler);
    $('#page_index').click(getOrderTableRows);
    $('#button_order_item').unbind('click').click(order_Item_clickhandler);
    input_validate();
});

//re-bind JQuery Events after UpdatePanel has been updated.
var prm = Sys.WebForms.PageRequestManager.getInstance();
prm.add_endRequest(function () {
    $('#button_order_item').unbind('click').click(order_Item_clickhandler);
});

//Get customer data from web service
function getCustomerData() {
    //alert("gg");
    $.ajax({
        type: "post",
        url: "WebService.asmx/Get_Customers",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: buildCustomerDatatable,
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


function buildCustomerDatatable(result) { 
    if (result.hasOwnProperty("d")) {
        result = result.d;
    }
    var data = JSON.parse(result);
    _oCustomerData = data;
   // var data = result;
    _odataCustomerTable = $('#table_customer').dataTable({
        "bRetrieve": true,
        "bPaginate": true,
        "bAutoWidth": false,
        "bDestroy":true,
        "iDisplayLength": 5,
        "sPaginationType": "full_numbers",
        "bJQueryUI": false,
        "sDom": '<"top"fr>t<"bottom"p><"clear">',
        //"fnRowCallback": customFnRowCallback,            
        "aaData": data,
        //"sAjaxSource": "WebService.asmx/Get_Customers",
        "aoColumns": [
            { "sTitle": "ID", "sWidth": "20%" },
            { "sTitle": "Name", "sWidth": "25%" },
            { "sTitle": "Email", "sWidth": "30%" },
            { "sTitle": "Address", "sWidth": "30%" },            
            { "sTitle": "Phone", "sWidth": "25%" },  
        ],
        "fnInitComplete": initCompleteHandler_Customer,
        "fnDrawCallback": function (oSettings) {
         var numcolumns = this.oApi._fnVisbleColumns(oSettings);
         addRows(this, numcolumns, 5);
        tableEventsConfiguration("table_customer")}
    });
   
}

  function buildOrderDatatable(result) {
     if (result.hasOwnProperty("d")) {
        result = result.d;
    }
    var data = JSON.parse(result);
    _oOrderData = data;
    // var data = result;
    _odataOrderTable = $('#table_order').dataTable({
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
            { "sTitle": "Order ID", "sWidth": "20px" },
            { "sTitle": "Customer ID","bVisible":false },
            { "sTitle": "Customer Name", "bVisible": false },
            { "sTitle": "Item ID", "bVisible": false},
            { "sTitle": "SN", "sWidth": "20px" },
            { "sTitle": "Item Name", "sWidth": "70px" },
            { "sTitle": "Price", "bVisible": false },
            { "sTitle": "Date", "sWidth": "20px" },
            { "sTitle": "Provider", "bVisible": false }
        ],
        "fnInitComplete": initCompleteHandler_Order,
        "fnDrawCallback": function (oSettings) {
            var numcolumns = this.oApi._fnVisbleColumns(oSettings);
            addRows(this, numcolumns, 5);
            tableEventsConfiguration("table_order")
        }
    });
}


//Callback funtion off Add Customer
//Get the data from web server, then rebind customer table.
function reGetCustomerData(result) {
    if (result.hasOwnProperty("d")) {
        result = result.d;
    }
    _customer_new_id = result;

    //alert(result.toString());
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
    _odataCustomerTable.fnAddData(data);
    //after regenerating the table,add handlers to it. 
    reloadCompleteHandler("table_customer");
}

function ReGainOrderData(result){
     if (result.hasOwnProperty("d")) {
        result = result.d;
         }
     var data = JSON.parse(result);
     _odataOrderTable.fnAddData(data);
     //if there's no data in the order table, change the current page to the first page. 
     if (_odataOrderTable.fnGetData(0) == null)
         _odataOrderTable.fnPageChange('first');
          
     reloadCompleteHandler("table_order");
}

function add_customer_button_clickhandler(e) {    
     _odataCustomerTable.fnClearTable(false);
     var fname = $('#tb_customer_firstname').val();
     var lname = $('#tb_customer_lastname').val();
     var phone = $('#tb_customer_phone').val();
     var address = $('#tb_customer_address').val();
     var email = $('#tb_customer_email').val();
     addCustomer(fname,lname, phone, address,email,reGetCustomerData);
 }

 function reload_order_info_table(customer_id) {
     _odataOrderTable.fnClearTable(false);    
   
     reload_order_info_table_data(customer_id, ReGainOrderData);
 
 }


 function initCompleteHandler_Customer() {
     $("#table_customer_wrapper").find(".top").append('<span class="table_title">Customer Information</span>');     
     tableEventsConfiguration("table_customer");      
 }

 function initCompleteHandler_Order() {
   $("#table_order_wrapper").find(".top").append('<span class="table_title">Order Information</span>');
   tableEventsConfiguration("table_order");      
 }


 function reloadCompleteHandler(table_id) {
     if (table_id == "table_customer") {
         if (_customer_new_id > 0) {
             var trNodes = _odataCustomerTable._fnGetTrNodes();
             $(trNodes).each(function () {
                 if ($(this).find(':first-child').text() == _customer_new_id) {
                     _odataCustomerTable.fnGetPageOfRow($(this));
                     $(this).click();
                 }
             });
         }
     }
     else if (table_id == "table_order") {
         if (_order_new_id > 0) {
             var trNodes = _odataOrderTable._fnGetTrNodes();
             $(trNodes).each(function () {
                 if ($(this).find(':first-child').text() == _order_new_id) {
                     _odataOrderTable.fnGetPageOfRow($(this));
                     $(this).click();
                 }
             });
         }

     }                     
     tableEventsConfiguration(table_id); 
 }
 //configure events for all the tables.
 function tableEventsConfiguration(tableId){
     $('#'+tableId+' tbody tr').hover(function(e){
      //mouseenter
      if(!$(this).hasClass('selected_row'))
      {$(this).addClass('mouseover_row');}

      },function(e){
      //mouseleave
      $(this).removeClass('mouseover_row');    
      });
      //Adding click event to rows of table
      //.off('click') first, or the event handler will be fired twice.
      $('#' + tableId + '>tbody> tr:not(.dummyrows)').off('click').click(function (e) {
          var tableNodes = _odataCustomerTable.fnGetHiddenTrNodes();
          $(tableNodes).each(function () {
              $(this).removeClass('selected_row');
          });
          $(this).addClass('selected_row');
          $(this).siblings().removeClass('selected_row');
          if (tableId == "table_customer") {
              var selectedIndex = $(this).find(':first-child').text();
              $('#order_customer_id').text(selectedIndex).val(selectedIndex);
             
              reload_order_info_table(selectedIndex);
          }
      });
  }

function addCustomer(firstname, lastname, phone, address,email,callback_add_customer) {
    $.ajax({
        type: "post",
        url: "WebService.asmx/Add_Customer",
        data: "{'first_name':'" + firstname + "','last_name':'" + lastname +
        "','phone':'" + phone + "','address':'" + address + "','email':'" + email + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callback_add_customer,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    });
}

function reload_order_info_table_data(customer_id,callback_reload_order_info_table) {
    $.ajax({
        type: "post",
        url: "WebService.asmx/Get_Orders_By_CustomerID",
        data: "{'customer_id':'" + customer_id + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callback_reload_order_info_table,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    });             

}

function getCustomerTableRows() {
    alert("getCustomerrows");
    var rows = _odataCustomerTable._fnGetTrNodes();
    alert("getCustomerrowsComplete");
    return rows;
}
function getOrderTableRows() {
    var data = _odataCustomerTable.fnGetData(3);     
    alert(data[3].toString());

}

function order_Item_clickhandler(e) {
    var customer_id = $("#order_customer_id").text();
    var item_id = $("#order_item_name_dropdown option[selected='selected']").val();
    var item_color = $("#order_item_color_dropdown  option[selected='selected']").text();  
    OrderItem(customer_id,item_id,item_color,order_item_callback);
}

function OrderItem(customer_id, item_id, item_color, callback_order_item) { 
         
    $.ajax({
        type: "post",
        url: "WebService.asmx/Order_Item",
        data: "{'customer_id':'" + customer_id + "','item_id':'" + item_id +
        "','item_color':'" + item_color +"'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callback_order_item,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    });
}

function order_item_callback(result) {
    if (result.hasOwnProperty("d")) {
        result = result.d;
    }
    _order_new_id = result;
    $('#hidden_button').unbind('click').click();
    var customer_id=$('#order_customer_id').text();
    reload_order_info_table(customer_id);
}

function focusout_validate_name() {
    if (!Ray_ValidateName($(this).val())) {

        $(this).siblings('img').remove().end().siblings('.warning').removeClass('hidden');
    }
    else {
          if ($(this).siblings('img').length<=0)
            $(this).after("<img alt='validated' class='check_img' src='Images/check_mark_green.png'/>").siblings('.warning').addClass('hidden');       
    }          
}

function focusout_validate_email() {
    
    if($(".check_img").length==0)
        $(this).after("<img alt='processing' id='e_exist' src='Images/e_exist.gif'/>")
        $('#tb_customer_email').siblings('div').addClass('hidden');
    Ray_CheckEmailExistence($(this).val(), Ray_CheckEmailCallback)
              
}

function focusout_validate_required() {
    if (!Ray_ValidateEmpty($(this).val())) {

        $(this).siblings('img').remove().end().siblings('.warning').removeClass('hidden');
    }
    else {
        if ($(this).siblings('img').length <= 0)
            $(this).after("<img alt='validated' class='check_img' src='Images/check_mark_green.png'/>").siblings('.warning').addClass('hidden');
    }          
}

function focusout_validate_phone() {
    if (!Ray_ValidatePhone($(this).val())) {

        $(this).siblings('img').remove().end().siblings('.warning').removeClass('hidden');
    }
    else {
        if ($(this).siblings('img').length <= 0)
            $(this).after("<img alt='validated' class='check_img' src='Images/check_mark_green.png'/>").siblings('.warning').addClass('hidden');
    }          
}

function input_validate() {
    $('.name_validate').each(function () {
        $(this).unbind('focusout').focusout(focusout_validate_name);
    })
    $('.email_validate').each(function () {
        $(this).unbind('focusout').focusout(focusout_validate_email);
    })

    $('.phone_validate').unbind('focusout').focusout(focusout_validate_phone);
    $('.required_validate').unbind('focusout').focusout(focusout_validate_required);

}