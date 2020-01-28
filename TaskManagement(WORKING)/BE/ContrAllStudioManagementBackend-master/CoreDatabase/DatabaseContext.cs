using ContrAllStudioManagementBackend.Models;
using CoreModels.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace CoreDatabase
{

    public class DatabaseContext : IdentityDbContext<UserModel, RoleModel,
                                   int, IdentityUserClaim<int>,
                                   UserRoleModel, IdentityUserLogin<int>,
                                   IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        //CREATE TABLE `__EFMigrationsHistory` ( `MigrationId` nvarchar(150) NOT NULL, `ProductVersion` nvarchar(32) NOT NULL, PRIMARY KEY (`MigrationId`) );
        //Script-Migration
        private static Boolean created = false;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL(GetConnectionString());
        }

        private static string GetConnectionString()
        {
            //return "server=86.123.53.33;port=63306;uid=BFY;password=contrAll;database=test-api";
            return "server=contrall.mysql.database.azure.com;port=3306;uid=BFY@contrall;password=ContrAll2018;database=3monthsReviewRM;convert zero datetime=True";
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
            modelBuilder.Entity<SubDomainModel>().HasKey(sdm => sdm.SubDomainId);
            modelBuilder.Entity<ProfileModel>()
                .HasKey(pm => pm.ProfileModelId);

            modelBuilder.Entity<Date>()
               .HasKey(d => d.DateId);

            modelBuilder.Entity<Clocking>()
                .HasKey(c => c.ClockingId);

            modelBuilder.Entity<Date>()
                .HasMany(date => date.Clockings)
                .WithOne(clocking => clocking.Date)
                .HasForeignKey(clocking => clocking.DateId);

            modelBuilder.Entity<UserModel>()
                .HasMany(user => user.VacationDays)
                .WithOne(vacationDay => vacationDay.User)
                .HasForeignKey(vacationDay => vacationDay.UserId);

            modelBuilder.Entity<ProfileModel>()
                .HasMany(pm => pm.Ibans)
                .WithOne(iban => iban.Profile);

            modelBuilder.Entity<SubDomainModel>()
                .HasMany(sdm => sdm.Profiles)
                .WithOne(p => p.SubDomain);

            modelBuilder.Entity<UserTaskModel>().HasKey(ut => new { ut.UserID, ut.TaskId });

            modelBuilder.Entity<UserTaskModel>()
                .HasOne(user => user.UserModel)
                .WithMany(u => u.UserTask)
                .HasForeignKey(ut => ut.UserID);

            modelBuilder.Entity<UserTaskModel>()
               .HasOne(user => user.TaskModel)
               .WithMany(u => u.UserTask)
               .HasForeignKey(ut => ut.TaskId);

            //modelBuilder.Entity<UserModel>().Ignore(e => e.FullName);

            modelBuilder.Entity<UserRoleModel>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });
            });


            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<FormulaModel>().Property(up => up.Deletable).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<SRModel>().Property(up => up.Deletable).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<SRModel>().Property(up => up.IsSpor).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<SubDomainModel>().Property(up => up.Enable).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<UserModel>().Property(up => up.EmailConfirmed).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<UserModel>().Property(up => up.PhoneNumberConfirmed).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<UserModel>().Property(up => up.LockoutEnabled).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<UserModel>().Property(up => up.TwoFactorEnabled).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<ClientModel>().Property(up => up.Ail).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<ClientModel>().Property(up => up.Asf).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<ClientModel>().Property(up => up.Vmg).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<ClientModel>().Property(up => up.Reg).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<ClientModel>().Property(up => up.Sal).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<ClientModel>().Property(up => up.Con).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<ClientModel>().Property(up => up.Imp).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<UserModel>().Property(up => up.ShouldGetPassword).HasConversion(new BoolToZeroOneConverter<Int16>());
            modelBuilder.Entity<VacationDayModel>().Property(up => up.State).HasConversion(new BoolToZeroOneConverter<Int16>());


        }

        public DbSet<FormulaModel> FormulaModels { get; set; }
        //public DbSet<Admin> Admins { get; set; }
        public DbSet<LegalDay> LegalDays { get; set; }
        public DbSet<SRModel> SRModels { get; set; }
        public DbSet<UpdatesModel> UpdatesModels { get; set; }
        public DbSet<SubDomainModel> SubDomainModels { get; set; }
        public DbSet<ProfileModel> ProfileModels { get; set; }
        public DbSet<IbanModel> IbanModels { get; set; }

        public DbSet<Date> Dates { get; set; }
        public DbSet<Clocking> Clockings { get; set; }

        public DbSet<ClientModel> UserModels { get; set; }
        public DbSet<UserModel> AppUserModels { get; set; }
        public DbSet<RoleModel> AppRoles { get; set; }
        public DbSet<UserRoleModel> AppUserRoleModel { get; set; }
        public DbSet<VacationDayModel> VacationDays { get; set; }
        public DbSet<TaskModel> TaskModels { get; set; }
        public DbSet<TaskStateModel> TaskStateModels { get; set; }
        public DbSet<UserTaskModel> UserTaskModels { get; set; }
    }
}

