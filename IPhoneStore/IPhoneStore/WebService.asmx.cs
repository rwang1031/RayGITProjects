using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Web.Script.Serialization;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace IPhoneStore
{
    /// <summary>
    /// Summary description for WebService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class WebService : System.Web.Services.WebService
    {

        [WebMethod]
        public string Get_Customers()
        {           
            DataTable dt=DataHelper.Get_Customers();
            JavaScriptSerializer jss = new JavaScriptSerializer();                  
            List<List<string>> rows = new List<List<string>>();
            List<string> row;
            foreach (DataRow dr in dt.Rows)
            {
                row = new List<string>();
                foreach (DataColumn col in dt.Columns)
                {
                    row.Add(dr[col].ToString());
                }
                rows.Add(row);
            }
          
            return jss.Serialize(rows);           
        }

        [WebMethod]
        public string Get_Stocklist()
        {
            DataTable dt = DataHelper.Get_Stocklist();
            JavaScriptSerializer jss = new JavaScriptSerializer();
            List<List<string>> rows = new List<List<string>>();
            List<string> row;
            foreach (DataRow dr in dt.Rows)
            {
                row = new List<string>();
                foreach (DataColumn col in dt.Columns)
                {
                    row.Add(dr[col].ToString());
                }
                rows.Add(row);
            }
            return jss.Serialize(rows);
        }

        [WebMethod]
        public string Get_Orders_By_CustomerID(string customer_id)
        {
            
            DataTable dt = DataHelper.Get_Order_By_Customer_ID(Convert.ToInt32(customer_id));
            JavaScriptSerializer jss = new JavaScriptSerializer();
            List<List<string>> rows = new List<List<string>>();
            List<string> row;
            foreach (DataRow dr in dt.Rows)
            {
                row = new List<string>();
                foreach (DataColumn col in dt.Columns)
                {
                    row.Add(dr[col].ToString());
                }
                rows.Add(row);
            }
           
            return jss.Serialize(rows);
        }

        [WebMethod]
        public string Add_Customer(string first_name,string last_name,string phone,string address,string email)
        {            
            if (email == String.Empty||first_name==String.Empty||last_name==String.Empty||Email_Validation(email)==false||Phone_Validation(phone)==false)
            {
                return "ValidationError";           
            }
                 
            int customerNewID=DataHelper.Add_Customer(first_name, last_name,phone,address,email);

            return customerNewID.ToString();
        }

        [WebMethod]
        public string Add_Item(string item_id, string color)
        {
            int itemSerialNumber = DataHelper.Add_Item(item_id, color);

            return itemSerialNumber.ToString();
        }

        [WebMethod]
        public string Order_Item(string customer_id,string item_id, string item_color)
        {
            int newOrderID = DataHelper.Order_Item(customer_id, item_id, item_color);

            return newOrderID.ToString();
        }

        private bool Email_Validation(String email)
        {
            try
            {
                MailAddress mail = new MailAddress(email);
            }
            catch 
            { 
               return false;
            }

            return true;
        }

        private bool Phone_Validation(String phone)
        {                  
            return   Regex.IsMatch(phone,@"^(\(?[0-9]{3}\)?)?\-?[0-9]{3}\-?[0-9]{4}$");          
        }

        [WebMethod]
        public string Check_Email_Existence(string email)
        {
            DataClasses1DataContext db = new DataClasses1DataContext();
            var customer = from item in db.Customer_Infos
                                 where item.Customer_Email == email
                                 select item;
            IQueryable<Customer_Info> li = customer;
            int count = li.Count();
            if (count == 0)
                return "false";
            else
                return "true";
        }


    }

   
}
