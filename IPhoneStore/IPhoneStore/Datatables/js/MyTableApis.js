
//get all the Nodes of rows which are not shown in the current displaying page.
$.fn.dataTableExt.oApi.fnGetHiddenTrNodes = function (oSettings) {
    /* Note the use of a DataTables 'private' function thought the 'oApi' object */
    var anNodes = this.oApi._fnGetTrNodes(oSettings);
    var anDisplay = $('tbody tr', oSettings.nTable);

    /* Remove nodes which are being displayed */
    for (var i = 0; i < anDisplay.length; i++) {
        var iIndex = jQuery.inArray(anDisplay[i], anNodes);
        if (iIndex != -1) {
            anNodes.splice(iIndex, 1);
        }
    }

    /* Fire back the array to the caller */
    return anNodes;
}


// get the page of a given item in order to paginate to it's page on load
$.fn.dataTableExt.oApi.fnGetPageOfRow = function (oSettings, iRow) {
    // get the displayLength being used
    var displayLength = oSettings._iDisplayLength;

    // get the array of nodes, sorted (default) and using current filters in place for all pages (default)   
    var taskListItems = this.$("tr", { "filter": "applied" });

    // if there's more than one page continue, else do nothing
    if (taskListItems.length <= displayLength) return;

    // get the index of the row inside that sorted/filtered array
    var index = taskListItems.index(iRow);

    // get the page by removing the decimals
    var page = Math.floor(index / displayLength);

    // paginate to that page
    this.fnPageChange(page);

    return page;
};

