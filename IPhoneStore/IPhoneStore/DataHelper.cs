using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Diagnostics;

namespace IPhoneStore
{
    public class DataHelper
    {
        protected static string _connectionString;             
       
        public DataHelper()
        {
                       
        }
        /// <summary>
        /// Configure SQLConnection, ConnectionString, and SQLCommand; 
        /// </summary>
        public static void Configuration()
        {                  
                           
        }
      
        /// <summary>
        /// Add A New Customer
        /// </summary>
        /// <param name="customer_name"></param>
        /// <param name="customer_address"></param>
        public static int Add_Customer(string firstname,string lastname, string customer_phone,
                                       string customer_address ,string customer_email)
        {
            SqlConnection _sqlConnection = new SqlConnection();
           String _connectionString = ConfigurationManager.ConnectionStrings["ApplicationServices"].ToString();
            _sqlConnection.ConnectionString = _connectionString;
           SqlCommand _cmd  = new SqlCommand();                          
            _cmd = new SqlCommand("dbo.RayStore_Add_Customer", _sqlConnection);
            _cmd.CommandType = CommandType.StoredProcedure; 
            _cmd.Parameters.AddWithValue("@Customer_FirstName", firstname);
            _cmd.Parameters.AddWithValue("@Customer_LastName", lastname);
            _cmd.Parameters.AddWithValue("@CustomerEmail", customer_email);
            _cmd.Parameters.AddWithValue("@CustomerPhone", customer_phone);
            _cmd.Parameters.AddWithValue("@CustomerAddress", customer_address);          
            _cmd.Parameters.Add("@CustomerNewID", SqlDbType.BigInt).Direction = ParameterDirection.Output;
            if(_sqlConnection.State==ConnectionState.Closed)
            _sqlConnection.Open();
            _cmd.ExecuteNonQuery();
            int customerNewID = Convert.ToInt32(_cmd.Parameters["@CustomerNewID"].Value);
            _sqlConnection.Close();
            return customerNewID;
        }

       
        public static int Add_Item(string item_id,string item_color)
        {
            SqlConnection _sqlConnection = new SqlConnection();
            String _connectionString = ConfigurationManager.ConnectionStrings["ApplicationServices"].ToString();
            _sqlConnection.ConnectionString = _connectionString;
            SqlCommand _cmd = new SqlCommand();  
            _cmd = new SqlCommand("dbo.RayStore_Add_Item", _sqlConnection);
            _cmd.CommandType = CommandType.StoredProcedure;
            _cmd.Parameters.AddWithValue("@Item_ID", item_id);
            _cmd.Parameters.AddWithValue("@Item_Color", item_color);
            _cmd.Parameters.Add("@Item_SN", SqlDbType.BigInt).Direction = ParameterDirection.Output;
           
            _sqlConnection.Open();
            _cmd.ExecuteNonQuery();
            int item_SN = Convert.ToInt32(_cmd.Parameters["@Item_SN"].Value);
            _sqlConnection.Close();
            return item_SN;
        }

        public static int Order_Item(string customer_id, string item_id,string item_color)
        {
            SqlConnection _sqlConnection = new SqlConnection();
            String _connectionString = ConfigurationManager.ConnectionStrings["ApplicationServices"].ToString();
            _sqlConnection.ConnectionString = _connectionString;
            SqlCommand _cmd = new SqlCommand();         
            _cmd = new SqlCommand("dbo.RayStore_Order_Item", _sqlConnection);
            _cmd.CommandType = CommandType.StoredProcedure;
            _cmd.Parameters.AddWithValue("@Customer_ID", customer_id);
            _cmd.Parameters.AddWithValue("@Item_ID", item_id);
            _cmd.Parameters.AddWithValue("@Item_Color", item_color);
            _cmd.Parameters.Add("@NewOrderID", SqlDbType.BigInt).Direction = ParameterDirection.Output;         
            _sqlConnection.Open();
            _cmd.ExecuteNonQuery();
            int newOrderID = Convert.ToInt32(_cmd.Parameters["@NewOrderID"].Value);
            _sqlConnection.Close();
            return newOrderID;
        }

        public static DataTable Get_Order_By_Customer_ID(int customer_id)
        {
            Debug.WriteLine("begin get order");
            SqlConnection _sqlConnection = new SqlConnection();
            String _connectionString = ConfigurationManager.ConnectionStrings["ApplicationServices"].ToString();
            _sqlConnection.ConnectionString = _connectionString;
            SqlCommand _cmd = new SqlCommand();  
             _cmd = new SqlCommand("dbo.RayStore_Get_Order_By_Customer", _sqlConnection);
            _cmd.CommandType = CommandType.StoredProcedure;
            _cmd.Parameters.AddWithValue("@Customer_ID", customer_id);          
            _sqlConnection.Open();
            Debug.WriteLine("get order connection opened");
            SqlDataAdapter sda=new SqlDataAdapter(_cmd);
            DataSet ds = new DataSet();
            sda.Fill(ds);
            DataTable dt = ds.Tables[0];            
            _sqlConnection.Close();
            Debug.WriteLine("end get order");
            return dt;
        }

        public static DataTable Get_Customers()
        {
            Debug.WriteLine("begin get customer");
            SqlConnection _sqlConnection = new SqlConnection();
            String _connectionString = ConfigurationManager.ConnectionStrings["ApplicationServices"].ToString();
            _sqlConnection.ConnectionString = _connectionString;
            SqlCommand _cmd = new SqlCommand();  
            _cmd = new SqlCommand("dbo.RayStore_Get_Customers", _sqlConnection);
            _cmd.CommandType = CommandType.StoredProcedure;
           
            _sqlConnection.Open();
            Debug.WriteLine("get customer connection opened");
            SqlDataAdapter sda = new SqlDataAdapter(_cmd);
            DataSet ds = new DataSet();
            sda.Fill(ds);
            DataTable dt = ds.Tables[0];
            _sqlConnection.Close();
            Debug.WriteLine("End get customer");
            return dt;
        }

        public static DataTable Get_Stocklist()
        {
            Debug.WriteLine("begin get Stocklist");
            SqlConnection _sqlConnection = new SqlConnection();
            String _connectionString = ConfigurationManager.ConnectionStrings["ApplicationServices"].ToString();
            _sqlConnection.ConnectionString = _connectionString;
            SqlCommand _cmd = new SqlCommand();
            _cmd = new SqlCommand("dbo.RayStore_Get_Stock_List", _sqlConnection);
            _cmd.CommandType = CommandType.StoredProcedure;
            _sqlConnection.Open();
            Debug.WriteLine("get stock connection opened");
            SqlDataAdapter sda = new SqlDataAdapter(_cmd);
            DataSet ds = new DataSet();
            sda.Fill(ds);
            DataTable dt = ds.Tables[0];
            _sqlConnection.Close();
            Debug.WriteLine("End get Stocklist");
            return dt;
        }

       
    }
}