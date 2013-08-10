<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeBehind="Default.aspx.cs" Inherits="IPhoneStore._Default" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
    <script type="text/javascript" charset="utf-8" src="Datatables/js/Main.js"></script>
    <script type="text/javascript" charset="utf-8" src="Datatables/js/add_customer_validation.js"></script>   
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <asp:ScriptManagerProxy runat="server">       
     <Scripts>
       <asp:ScriptReference Path="Datatables/js/Main.js" />
     </Scripts>
    </asp:ScriptManagerProxy>
    <div id="div_tables">
      <table id="table_customer" class="display defaultPage">
      </table>
      <table id="table_order" class="display defaultPage">
      </table>     
    </div>        
    <div id="div_inputs">
     <fieldset id="div_add_customer">
      <legend class="titles_m">Add Customer</legend>
       <div class="div_collapse">
        <table class="input_tables">
         <tr>
          <td class="add_c_td1">Firstname:</td >
          <td class="add_c_td2"><input type="text" id="tb_customer_firstname" class="name_validate"/><br/>
              <div class="hidden warning">Invalid:1-15 characters.</div></td>          
         </tr>
         <tr>
          <td>Lastname:</td>
          <td><input type="text" id="tb_customer_lastname" class="name_validate" /><br />
              <div class="hidden warning">
                  Invalid: 1-15 characters.</div>
          </td>            
         </tr>
         <tr>
          <td>Email:</td>
          <td><input type="text" id="tb_customer_email" class="email_validate" /><br />
              <div class="hidden warning">
                  Invalid Email Name.</div>
              <div id="email_e_warning" class="hidden">
                  This Email Already Exist.</div>
          </td>            
         </tr>
         <tr>
          <td>Phone Number:</td>
          <td><input type="text" id="tb_customer_phone" class="phone_validate" /><br />
              <div class="hidden warning">
                  Invalid phone: ddd-ddd-dddd.</div>
          </td>           
         </tr>
         <tr>
          <td>Address:</td>
          <td><input type="text" id="tb_customer_address"/></td>
         </tr>
          <tr>
          <td></td>
          <td><input type="button" id="button_add_customer" value="Add Customer"/></td>
          </tr>
        </table>            
       </div>           
     </fieldset>
    <asp:UpdatePanel runat="server" ID="UpdatePanel1" ClientIDMode="Static" ChildrenAsTriggers="true" >
    <Triggers>
    <asp:AsyncPostBackTrigger ControlID="order_mf_dropdown" EventName="SelectedIndexChanged" />
    <asp:AsyncPostBackTrigger ControlID="order_item_type_dropdown" EventName="SelectedIndexChanged" />
    <asp:AsyncPostBackTrigger ControlID="order_item_name_dropdown" EventName="SelectedIndexChanged" />
    <asp:AsyncPostBackTrigger ControlID="order_item_color_dropdown" EventName="SelectedIndexChanged"/>
    <asp:AsyncPostBackTrigger ControlID="hidden_button" EventName="Click" />
    </Triggers>
    <ContentTemplate>
     <fieldset id="div_order_item">   
      <legend class="titles_m">Order Item</legend>  
      <div id="div_mf_wrapper">
        <table class="input_tables">      
         <tr>
          <td>Manufacturer:</td>
          <td><asp:DropDownList runat="server" ID="order_mf_dropdown" AutoPostBack="true" ClientIDMode="Static"
                  CssClass="order_dropdowns" DataSourceID="Manufacturer_Ss" DataTextField="Manufacturer_Name"
                  DataValueField="Manufacturer_ID">
                </asp:DropDownList></td>
         </tr>
         <tr>
          <td>Item Type:</td>
          <td>
              <asp:DropDownList runat="server" ID="order_item_type_dropdown" AutoPostBack="true"
                  CssClass="order_dropdowns" ClientIDMode="Static" DataSourceID="Item_Type_Source"
                  DataTextField="Item_Type_Name" DataValueField="Item_Type_ID"></asp:DropDownList>
          </td>
         </tr>      
         <tr>
          <td>Item Name:</td>
          <td>
              <asp:DropDownList runat="server" ClientIDMode="Static" ID="order_item_name_dropdown"
                  DataSourceID="Item_Name_Datasource" CssClass="order_dropdowns" DataValueField="Item_ID"
                  DataTextField="Item_Name" AutoPostBack="true" >
              </asp:DropDownList>
          </td>
         </tr>
         <tr>
          <td>Item Color:</td>
          <td>
              <asp:DropDownList runat="server" ClientIDMode="Static" ID="order_item_color_dropdown"
                  CssClass="order_dropdowns" DataSourceID="Color_Source" DataTextField="Color_Name"
                  DataValueField="Color_ID" AutoPostBack="true">
              </asp:DropDownList>
          </td>
         </tr> 
          <tr>
          <td></td>
          <td><input type="button" id="button_order_item" value="OrderItem" /> </td>
         </tr>                        
        </table>
       </div>             
     <div id="div_PhoneImage">
     <div id="stock_amount_div">
     <span>Amount In Stock:</span>&nbsp; 
     <asp:Label ID="Stock_Remaining_l" ClientIDMode="Static" runat="server"></asp:Label>
     </div>
     <asp:Image runat="server" ID="PhoneImage" AlternateText="PhoneImage" ClientIDMode="Static"
         ImageUrl="~/Images/RayIphoneBlack1.jpg" />    
     </div>
    </fieldset>
    </ContentTemplate>
    </asp:UpdatePanel>
    </div>
    <div id="customer_id_wrapper">
        <table id="customer_id_table">
            <tr>
                <td>
                    Customer ID:
                </td>
                <td>
                    <span id="order_customer_id"></span>
                </td>
            </tr>
        </table>
    </div>
    <asp:SqlDataSource runat ="server" ID="Item_Name_Datasource" 
        ConnectionString="<%$ ConnectionStrings:ApplicationServices %>" 
        SelectCommand="SELECT [Item_ID], [Item_Name] FROM [Item_Info] WHERE (([Item_Type_ID] = @Item_Type_ID) AND ([Item_Manufacturer_ID] = @Item_Manufacturer_ID))">
        <SelectParameters>
            <asp:ControlParameter ControlID="order_item_type_dropdown" DefaultValue="1" 
                Name="Item_Type_ID" PropertyName="SelectedValue" Type="Int64" />
            <asp:ControlParameter ControlID="order_mf_dropdown" DefaultValue="1" 
                Name="Item_Manufacturer_ID" PropertyName="SelectedValue" Type="Int64" />
        </SelectParameters>
    </asp:SqlDataSource>

    <asp:SqlDataSource runat="server" ID="Manufacturer_Ss" ConnectionString="<%$ ConnectionStrings:ApplicationServices %>"
          SelectCommand="SELECT [Manufacturer_ID], [Manufacturer_Name] FROM [Manufacturer_Info]">
    </asp:SqlDataSource>

    <asp:SqlDataSource runat="server" ID="Item_Type_Source" 
        ConnectionString="<%$ ConnectionStrings:ApplicationServices %>" 
        SelectCommand="SELECT * FROM [Item_Type_Info]"></asp:SqlDataSource>

    <asp:SqlDataSource runat="server" ID="Color_Source" 
        ConnectionString="<%$ ConnectionStrings:ApplicationServices %>" 
        SelectCommand="SELECT * FROM [Item_Color_Info]"></asp:SqlDataSource> 
        
    <asp:Button runat="server" ID="hidden_button" class="hidden"  ClientIDMode="Static" />    
            
</asp:Content>
