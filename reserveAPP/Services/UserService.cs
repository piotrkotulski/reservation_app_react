using System.Data;
using System.Data.SqlClient;
using reserveAPP.Models;

namespace reserveAPP.Services
{
    public class UserService
    {
        private readonly string _connectionString;

        public UserService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void CreateUser(UserModel user)
        {
            string query = @"
                INSERT INTO dbo.Users (FirstName, LastName, Email, PhoneNumber)
                VALUES (@FirstName, @LastName, @Email, @PhoneNumber)";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@FirstName", user.FirstName);
                    myCommand.Parameters.AddWithValue("@LastName", user.LastName);
                    myCommand.Parameters.AddWithValue("@Email", user.Email);
                    myCommand.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);
                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public void UpdateUser(int userId, UserModel user)
        {
            string query = @"
                UPDATE dbo.Users
                SET FirstName = @FirstName, LastName = @LastName, Email = @Email, PhoneNumber = @PhoneNumber
                WHERE UserId = @UserId";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@UserId", userId);
                    myCommand.Parameters.AddWithValue("@FirstName", user.FirstName);
                    myCommand.Parameters.AddWithValue("@LastName", user.LastName);
                    myCommand.Parameters.AddWithValue("@Email", user.Email);
                    myCommand.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);

                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public DataTable GetUsers()
        {
            string query = "SELECT UserId, FirstName, LastName, Email, PhoneNumber FROM dbo.Users";
            DataTable table = new DataTable();

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            return table;
        }

        public DataTable GetUser(int userId)
        {
            string query = "SELECT UserId, FirstName, LastName, Email, PhoneNumber FROM dbo.Users WHERE UserId = @UserId";
            DataTable table = new DataTable();

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@UserId", userId);
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            return table;
        }

        public void DeleteUser(int userId)
        {
            string query = "DELETE FROM dbo.Users WHERE UserId = @UserId";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@UserId", userId);
                    myCommand.ExecuteNonQuery();
                }
            }
        }
    }
}