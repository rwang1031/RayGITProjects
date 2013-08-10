<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="StockInventory.aspx.cs" Inherits="IPhoneStore.StockInventory" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script type="text/javascript" src="~/Scripts/inventory.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <asp:ScriptManagerProxy runat="server" ID="SMP">
      <Scripts>
        <asp:ScriptReference Path="~/Scripts/inventory.js"  />
      </Scripts>
   </asp:ScriptManagerProxy>

   <div id="table_inventory_ourter_wrapper"> 
  <table id="table_inventory" class="display">
  </table>
  </div>
    <asp:UpdatePanel runat="server" ID="UpdatePanel1" ChildrenAsTriggers="true" ClientIDMode="Static">
        <Triggers>
            <asp:AsyncPostBackTrigger ControlID="Manufacturer_Dp" EventName="SelectedIndexChanged" />
            <asp:AsyncPostBackTrigger ControlID="Type_DP" EventName="SelectedIndexChanged" />
        </Triggers>
            
  <ContentTemplate>
  <div id="div_add_item" class="div_collapse">
        <table>
         <tr>
             <td>
                 Manufacturer:
             </td>
             <td>
                 <asp:DropDownList ID="Manufacturer_Dp" runat="server" Width="156px" DataSourceID="Manufacturer_Ss"
                     DataTextField="Manufacturer_Name" DataValueField="Manufacturer_ID" AutoPostBack="true"
                     ClientIDMode="Static" >
                 </asp:DropDownList>
             </td>
         </tr>
            <tr>
                <td>
                    Item Type:
                </td>
                 <td>
                     <asp:DropDownList runat="server" ID="Type_DP"  AutoPostBack="true"
                        CssClass="order_dropdowns"  ClientIDMode="Static"  DataSourceID="Item_Type_Source"
                         DataTextField="Item_Type_Name"  DataValueField="Item_Type_ID">
                    </asp:DropDownList>
                </td>
            </tr>
         <tr>
             <td>
                 Item Name:
             </td>
             <td>
                 <asp:DropDownList ID="Item_Dp" runat="server" DataTextField="Item_Name" Width="156px"
                     DataValueField="Item_ID" ClientIDMode="Static" DataSourceID="Item_Name_Datasource">
                 </asp:DropDownList>
             </td>
         </tr>
            <tr>
                <td>
                    Item Color:
                </td>
                <td>
                    <asp:DropDownList runat="server" ClientIDMode="Static" ID="Color_ID" CssClass="order_dropdowns"
                        DataSourceID="Color_Source" DataTextField="Color_Name" DataValueField="Color_ID"
                        >
                    </asp:DropDownList>
                </td>
            </tr>
        </table>
        <input type="button" id="button_add_item" value="Add"/>             
       </div>
      </ContentTemplate>
      </asp:UpdatePanel> 
       

       <asp:SqlDataSource runat="server" ID="Manufacturer_Ss" 
        ConnectionString="<%$ ConnectionStrings:ApplicationServices %>" 
        SelectCommand="SELECT [Manufacturer_ID], [Manufacturer_Name] FROM [Manufacturer_Info]"></asp:SqlDataSource>
       <asp:SqlDataSource runat="server" ID="Color_Source" ConnectionString="<%$ ConnectionStrings:ApplicationServices %>"
        SelectCommand="SELECT * FROM [Item_Color_Info]"></asp:SqlDataSource>
    <asp:SqlDataSource runat="server" ID="Item_Name_Datasource" ConnectionString="<%$ ConnectionStrings:ApplicationServices %>"
        SelectCommand="SELECT [Item_ID], [Item_Name] FROM [Item_Info] WHERE (([Item_Type_ID] = @Item_Type_ID) AND ([Item_Manufacturer_ID] = @Item_Manufacturer_ID))">
        <SelectParameters>
            <asp:ControlParameter ControlID="Type_DP" DefaultValue="1" Name="Item_Type_ID" PropertyName="SelectedValue"
                Type="Int64" />
            <asp:ControlParameter ControlID="Manufacturer_Dp" DefaultValue="1" Name="Item_Manufacturer_ID"
                PropertyName="SelectedValue" Type="Int64" />
        </SelectParameters>
    </asp:SqlDataSource>
    <asp:SqlDataSource runat="server" ID="Item_Type_Source" ConnectionString="<%$ ConnectionStrings:ApplicationServices %>"
        SelectCommand="SELECT * FROM [Item_Type_Info]"></asp:SqlDataSource>
</asp:Content>
