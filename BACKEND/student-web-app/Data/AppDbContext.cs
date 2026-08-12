using Microsoft.EntityFrameworkCore;
using student_Project_Managment_System.Models;

namespace student_Project_Managment_System.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options)
        {}
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<users_otp> Users_Otps { get; set; }
        public DbSet<AccountSetupTokens> AccountSetupTokens { get; set; }
        public DbSet<DepartmentMaster> Departmnets { get; set; }
        public DbSet<StatusMaster> StatusMasters { get; set; }
        public DbSet<Student> Studnets { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Priority> Priorities { get; set; }
        public DbSet<StudentProject> StudentProjects { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<student_Project_Managment_System.Models.Task> Tasks { get; set; }
        public DbSet<WeeklyProgress> WeeklyProgresses { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Users>()
                .HasIndex(s => s.Email)
                .IsUnique();

            modelBuilder.Entity<Users>()
                .HasOne(u => u.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(u => u.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Users>()
                .HasOne(u => u.UserRole)
                .WithMany()
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AccountSetupTokens>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Users>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("GetDate()");

            modelBuilder.Entity<Users>()
                .Property(u => u.UpdatedAt)
                .HasDefaultValueSql("GetDate()");

            modelBuilder.Entity<DepartmentMaster>()
               .Property(u => u.CreatedAt)
               .HasDefaultValueSql("GetDate()");

            modelBuilder.Entity<DepartmentMaster>()
                .Property(u => u.UpdatedAt)
                .HasDefaultValueSql("GetDate()");

            modelBuilder.Entity<Project>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("GetDate()");
            
            modelBuilder.Entity<Project>()
               .Property(u => u.UpdatedAt)
               .HasDefaultValueSql("GetDate()");

            modelBuilder.Entity<AccountSetupTokens>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("GetDate()");

            modelBuilder.Entity<Priority>()
            .Property(u => u.Created)
            .HasDefaultValueSql("GetDate()");

            modelBuilder.Entity<Users>()
                 .Property(u => u.isDeleted)
                  .HasDefaultValue(0);

            modelBuilder.Entity<Users>()
                .Property(u => u.isVerified)
                .HasDefaultValue(0);

            modelBuilder.Entity<Users>()
                .Property(u => u.UpdatedBy)
                .HasDefaultValue(0);

            modelBuilder.Entity<Project>()
                .HasIndex(p => p.projectcode)
                .IsUnique();

            modelBuilder.Entity<Project>()
                .HasIndex(p => p.projecttitle)
                .IsUnique();


            modelBuilder.Entity<student_Project_Managment_System.Models.Task>()
                .HasOne(p => p.Project)
                .WithMany(t => t.Tasks)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Priority)
                .WithMany(p => p.projects)
                .HasForeignKey(p => p.PriorityId);


            modelBuilder.Entity<student_Project_Managment_System.Models.Task>()
                .HasOne(p => p.Priority)
                .WithMany(t => t.task)
                .HasForeignKey(p => p.PriorityId);

            modelBuilder.Entity<student_Project_Managment_System.Models.Task>()
                .HasOne(u =>  u.Users)
                .WithMany()
                .HasForeignKey(u => u.UserId);

            modelBuilder.Entity<StudentProject>()
                .HasOne(sp => sp.ApprovedByUsers)
                .WithMany(u => u.ApprovedProject)
                .HasForeignKey(sp => sp.ApprovedByUserId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<StudentProject>()
                .HasOne(sp => sp.CoordinatorUser)
                .WithMany(u => u.CoordinatedProject)
                .HasForeignKey(sp => sp.CoordinatorId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<StudentProject>()
                .HasOne(s => s.Student)
                .WithMany(sp => sp.StudentProjects)
                .HasForeignKey(sp => sp.StudentId);

            modelBuilder.Entity<StudentProject>()
                .HasOne(s => s.Department)
                .WithMany()
                .HasForeignKey(sp => sp.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Student>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.StudentProject)
                .WithMany()
                .HasForeignKey(e => e.StudentProjectId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.Task)
                .WithMany()
                .HasForeignKey(e => e.TaskId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.EvaluatedByUser)
                .WithMany()
                .HasForeignKey(e => e.EvaluatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.StatusMaster)
                .WithMany()
                .HasForeignKey(e => e.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WeeklyProgress>()
               .HasOne(e => e.StudentProject)
               .WithMany()
               .HasForeignKey(e => e.StudentProjectId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WeeklyProgress>()
               .HasOne(e => e.StatusMaster)
               .WithMany()
               .HasForeignKey(e => e.StatusId)
               .OnDelete(DeleteBehavior.Restrict);


        }
    }

}
