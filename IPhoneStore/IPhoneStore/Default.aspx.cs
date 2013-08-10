using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace IPhoneStore
{
    public partial class _Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack)
            {
                SwitchPhoneImages();             
            }
             
        }
        protected void Page_PreRenderComplete(object sender, EventArgs e)
        {
            Stock_Remaining_l.Text = Get_Stock_Remainings().ToString();
            DropDownsSimplify();
        }

        protected void order_mf_dropdown_SelectedIndexChanged(object sender, EventArgs e)
        {
             
        }

        protected void order_item_type_dropdown_SelectedIndexChanged(object sender, EventArgs e)
        {
            DropDownList M_DropDown = (DropDownList)sender;
            Int64 index = Convert.ToInt64(M_DropDown.SelectedValue);
            DataClasses1DataContext db = new DataClasses1DataContext();
            var itemDataSource = from item in db.Item_Infos
                                 where item.Item_Manufacturer_ID == index
                                 select item;
            order_item_name_dropdown.DataSource = itemDataSource;
            order_item_name_dropdown.DataBind();                                
        }

        private object Order_Item_Name_Datasource(long item_type_id, long item_mf_id)
        {
            DataClasses1DataContext db = new DataClasses1DataContext();
            var itemDataSource = from item in db.Item_Infos
                                 where item.Item_Manufacturer_ID == item_type_id && item.Item_Type_ID== item_mf_id 
                                 select item;          
            return itemDataSource;
        }

        private object Order_Item_Type_Datasource()
        {
            DataClasses1DataContext db = new DataClasses1DataContext();
            var itemDataSource = from item in db.Item_Type_Infos 
                                 select item;
            return itemDataSource;
        }

        private object Order_Item_MF_Datasource()
        {
            DataClasses1DataContext db = new DataClasses1DataContext();
            var itemDataSource = from item in db.Manufacturer_Infos
                                 select item;
            return itemDataSource;
        }

        private int Get_Stock_Remaining(string itemid, string color)
        {
            DataClasses1DataContext db = new DataClasses1DataContext();
            var itemDataSource = from item in db.Item_Storage_Infos
                                 where item.Item_ID.ToString() == itemid && item.Item_Color.ToLower() == color.ToLower()
                                 select item;

            IQueryable<Item_Storage_Info> li = itemDataSource;         

            int count = li.Count();

            return count;
        }

        private int Get_Stock_Remainings()
        {
            string itemId = order_item_name_dropdown.SelectedValue;
            string color = order_item_color_dropdown.SelectedItem.Text;
            return  Get_Stock_Remaining(itemId,color);           
        }

        private void SwitchPhoneImages()
        {
            if (order_mf_dropdown.SelectedValue == "1")
            {
               if (order_item_type_dropdown.SelectedValue=="1")
               {
                   if (order_item_color_dropdown.SelectedValue == "1")
                   {
                       PhoneImage.ImageUrl = "~/Images/RayIphoneBlack1.jpg";
                   }
                   else if (order_item_color_dropdown.SelectedValue == "2")
                   {
                       PhoneImage.ImageUrl = "~/Images/RayIphoneWhite1.jpg";
                   }
               
               }
               else if (order_item_type_dropdown.SelectedValue == "2") 
               {
                   if (order_item_color_dropdown.SelectedValue == "1")
                   {
                       PhoneImage.ImageUrl = "~/Images/RayIPadBlack1.jpg";
                   }
                   else if (order_item_color_dropdown.SelectedValue == "2")
                   {
                       PhoneImage.ImageUrl = "~/Images/RayIPadWhite1.jpg";
                   }
               
               }
            }
            else
            {
                if (order_item_type_dropdown.SelectedValue == "1")
                {
                    if (order_item_color_dropdown.SelectedValue == "1")
                    {
                        PhoneImage.ImageUrl = "~/Images/RaySphoneBlack1.jpg";
                    }
                    else if (order_item_color_dropdown.SelectedValue == "2")
                    {
                        PhoneImage.ImageUrl = "~/Images/RaySphoneWhite1.jpg";
                    }

                }
                else if (order_item_type_dropdown.SelectedValue == "2")
                {
                    if (order_item_color_dropdown.SelectedValue == "1")
                    {
                        PhoneImage.ImageUrl = "~/Images/RaySPadBlack1.jpg";
                    }
                    else if (order_item_color_dropdown.SelectedValue == "2")
                    {
                        PhoneImage.ImageUrl = "~/Images/RaySPadWhite1.jpg";
                    }

                }
            }               
        }

        private void DropDownsSimplify()
        { 
           string text= order_item_name_dropdown.SelectedItem.Text;
           order_item_name_dropdown.SelectedItem.Text = StringSimplifier(text);      
        }

        private string StringSimplifier(String str)
        {

            String simpStr = str;
            if (str.Length >10)
            {
                if (str.Contains("Galaxy"))
                {
          
                  simpStr=str.Replace("Galaxy", "G");
                  
                }
            }

            return simpStr;
            
        }


    }
}
