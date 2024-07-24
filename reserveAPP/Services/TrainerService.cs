using System.Collections.Generic;
using System.Data.SqlClient;
using reserveAPP.Models;

namespace reserveAPP.Services
{
    public class TrainerService
    {
        private readonly string _connectionString;

        public TrainerService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IEnumerable<Trainer> GetAllTrainers()
        {
            var Trainers = new List<Trainer>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var command = new SqlCommand("SELECT * FROM Trainers", connection);
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Trainers.Add(new Trainer
                        {
                            ID = (int)reader["ID"],
                            FirstName = (string)reader["FirstName"],
                            LastName = (string)reader["LastName"],
                            Email = (string)reader["Email"],
                            PhoneNumber = reader["PhoneNumber"] as string
                        });
                    }
                }
            }
            return Trainers;
        }

        public Trainer GetTrainer(int id)
{
    Trainer trainer = null;
    using (var connection = new SqlConnection(_connectionString))
    {
        connection.Open();
        var command = new SqlCommand("SELECT * FROM Trainers WHERE ID = @ID", connection);
        command.Parameters.AddWithValue("@ID", id);
        using (var reader = command.ExecuteReader())
        {
            if (reader.Read())
            {
                trainer = new Trainer
                {
                    ID = (int)reader["ID"],
                    FirstName = (string)reader["FirstName"],
                    LastName = (string)reader["LastName"],
                    Email = (string)reader["Email"],
                    PhoneNumber = reader["PhoneNumber"] as string
                };
            }
        }
    }
    return trainer;
}

        public void AddTrainer(Trainer trainer)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var command = new SqlCommand("INSERT INTO Trainers (FirstName, LastName, Email, PhoneNumber) VALUES (@FirstName, @LastName, @Email, @PhoneNumber)", connection);
                    command.Parameters.AddWithValue("@FirstName", trainer.FirstName);
                    command.Parameters.AddWithValue("@LastName", trainer.LastName);
                    command.Parameters.AddWithValue("@Email", trainer.Email);
                    command.Parameters.AddWithValue("@PhoneNumber", trainer.PhoneNumber ?? (object)DBNull.Value);
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                // Logowanie błędu
                Console.WriteLine($"Error in AddTrainer: {ex.Message}");
                throw;
            }
        }

        public void UpdateTrainer(Trainer Trainer)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var command = new SqlCommand("UPDATE Trainers SET FirstName = @FirstName, LastName = @LastName, Email = @Email, PhoneNumber = @PhoneNumber WHERE ID = @ID", connection);
                command.Parameters.AddWithValue("@ID", Trainer.ID);
                command.Parameters.AddWithValue("@FirstName", Trainer.FirstName);
                command.Parameters.AddWithValue("@LastName", Trainer.LastName);
                command.Parameters.AddWithValue("@Email", Trainer.Email);
                command.Parameters.AddWithValue("@PhoneNumber", Trainer.PhoneNumber ?? (object)DBNull.Value);
                command.ExecuteNonQuery();
            }
        }

        public void DeleteTrainer(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var command = new SqlCommand("DELETE FROM Trainers WHERE ID = @ID", connection);
                command.Parameters.AddWithValue("@ID", id);
                command.ExecuteNonQuery();
            }
        }
    }
}