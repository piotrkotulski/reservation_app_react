using System.Data;
using System.Data.SqlClient;
using reserveAPP.Models;

namespace reserveAPP.Services
{
    public class UserGroupService
    {
        private readonly string _connectionString;

        public UserGroupService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void CreateUserGroup(UserGroupModel group)
        {
            string query = @"
                INSERT INTO dbo.UserGroups (GroupName, GroupColor)
                VALUES (@GroupName, @GroupColor)";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@GroupName", group.GroupName);
                    myCommand.Parameters.AddWithValue("@GroupColor", group.GroupColor);
                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public void UpdateUserGroup(int groupId, UserGroupModel group)
        {
            string query = @"
                UPDATE dbo.UserGroups
                SET GroupName = @GroupName, GroupColor = @GroupColor
                WHERE UserGroupId = @UserGroupId";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@UserGroupId", groupId);
                    myCommand.Parameters.AddWithValue("@GroupName", group.GroupName);
                    myCommand.Parameters.AddWithValue("@GroupColor", group.GroupColor);

                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public DataTable GetUserGroups()
        {
            string query = "SELECT UserGroupId, GroupName, GroupColor FROM dbo.UserGroups";
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

        public DataTable GetUserGroup(int groupId)
        {
            string query = "SELECT UserGroupId, GroupName, GroupColor FROM dbo.UserGroups WHERE UserGroupId = @UserGroupId";
            DataTable table = new DataTable();

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@UserGroupId", groupId);
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            return table;
        }

        public void DeleteUserGroup(int groupId)
        {
            string query = "DELETE FROM dbo.UserGroups WHERE UserGroupId = @UserGroupId";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@UserGroupId", groupId);
                    myCommand.ExecuteNonQuery();
                }
            }
        }
    }
}
