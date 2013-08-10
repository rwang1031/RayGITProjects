///<reference path="~/Datatables/js/jquery-1.10.2.js" />
///<reference path="~/Datatables/js/jquery.dataTables.js" />
///<reference path="~/Site.Master">
///<reference path="~/Datatables/js/MyTableApis.js">

var _ostockdataTable;
var _new_SN;

$(function () {
    geStockInventoryData();
    $('#button_add_item').unbind('click').click(add_item_button_clickhandler);
});

//re-bind JQuery Events after UpdatePanel has been updated.
var prm = Sys.WebForms.PageRequestManager.getInstance();
prm.add_endRequest(function () {
    $('#button_add_item').unbind('click').click(add_item_button_clickhandler);
});


//Get stock inventory data from web service
function geStockInventoryData() {
    
    $.ajax({
        type: "post",
        url: "WebService.asmx/Get_Stocklist",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: buildIventoryDatatable,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    });
}

function buildIventoryDatatable(result) {
    if (result.hasOwnProperty("d")) {
        result = result.d;
    }
    var data = JSON.parse(result);
    // var data = result;
    _ostockdataTable = $('#table_inventory').dataTable({
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
            { "sTitle": "Serial Number", "sWidth": "10%" },
            { "sTitle": "ItemID", "sWidth": "15%" },
            { "sTitle": "Item Name", "sWidth": "12%" },
            { "sTitle": "Item Color", "sWidth": "12%" },
            { "sTitle": "Price", "sWidth": "12%" },
            { "sTitle": "Currency Type", "sWidth": "12%" },
            { "sTitle": "Manufacturer", "sWidth": "12%" },
            { "sTitle": "Logo", "sWidth": "12%" }
        ],
        "fnInitComplete": initCompleteHandler_Inventory,
       
        "fnDrawCallback": function (oSettings) { tableEventsConfiguration_Inventory("table_inventory") }
    });
}

function initCompleteHandler_Inventory() {
    $("#table_inventory_wrapper").find(".top").append('<span class="table_title">Stock Iventory Information</span>');
    tableEventsConfiguration_Inventory("table_inventory");
}

//configure events for all the tables.
function tableEventsConfiguration_Inventory(tableId) {
    
    $('#' + tableId + ' tbody tr').hover(function (e) {
        //mouseenter
        if (!$(this).hasClass('selected_row'))
        { $(this).addClass('mouseover_row'); }

    }, function (e) {
        //mouseleave
        $(this).removeClass('mouseover_row');
    });
    //Adding click event to rows of table
    //.off('click') first, or the event handler will be fired twice.
    $('#' + tableId + '>tbody> tr').off('click').click(function (e) {
        var tableNodes = _ostockdataTable.fnGetHiddenTrNodes();
        $(tableNodes).each(function () {
            $(this).removeClass('selected_row');
        });
        $(this).addClass('selected_row');
        $(this).siblings().removeClass('selected_row');
    });
}

function add_item_button_clickhandler() {
    _ostockdataTable.fnClearTable();
    var manufacturer = $('#Manufacturer_Dp').val();
    var itemId = $('#Item_Dp').val();
    var color = $('#Color_ID option[selected="selected"]').text();
    addItem(itemId, color, reGetItemData);
}

function addItem(item_id, color, callback_add_item) {
    $.ajax({
        type: "post",
        url: "WebService.asmx/Add_Item",
        data: "{'item_id':'" + item_id +
        "','color':'" + color + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callback_add_item,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    })
}


function reGetItemData(result) {
    if (result.hasOwnProperty("d")) {
        result = result.d;
    }
     _new_SN = result;

    //alert(result.toString());
    $.ajax({
        type: "post",
        url: "WebService.asmx/Get_Stocklist",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ReGainData_Inventory,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    });
}

function ReGainData_Inventory(result) {
    if (result.hasOwnProperty("d")) {
        result = result.d;
    }
    var data = JSON.parse(result);
    _ostockdataTable.fnAddData(data);
    //after regenerating the table,add handlers to it. 
    reloadCompleteHandler_Inventory();
}

function reloadCompleteHandler_Inventory() {
    if (_new_SN > 0) {
        var trNodes = _ostockdataTable._fnGetTrNodes();
        $(trNodes).each(function () {
            if ($(this).find(':first-child').text() == _new_SN) {
                _ostockdataTable.fnGetPageOfRow($(this));              
                $(this).click();
            }
        });
    }
    tableEventsConfiguration_Inventory("table_inventory");
}
