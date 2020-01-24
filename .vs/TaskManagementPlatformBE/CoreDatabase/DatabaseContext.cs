using CoreModels.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace CoreDatabase
{
    public class DatabaseContext : IdentityDbContext<UserModel, RoleModel, int>
    {

        private static Boolean created = false;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL(GetConnectionString());
        }

        private static string GetConnectionString()
        {
            //return "server=86.123.53.33;port=63306;uid=BFY;password=contrAll;database=test-api";
            return "server=contrall.mysql.database.azure.com;port=3306;uid=BFY@contrall;password=ContrAll2018;database=3MonthsReviewRM;convert zero datetime=True";
        }

        public void CreateDatabaseIfNotExists()
        {
            lock (this)
            {
                if (!created)
                {
                    Database.EnsureCreated();
                }

                created = true;
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UserModel>().Property(up => up.EmailConfirmed).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<UserModel>().Property(up => up.PhoneNumberConfirmed).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<UserModel>().Property(up => up.LockoutEnabled).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<UserModel>().Property(up => up.TwoFactorEnabled).HasConversion(new BoolToZeroOneConverter<Int16>());
        }
    }
}
