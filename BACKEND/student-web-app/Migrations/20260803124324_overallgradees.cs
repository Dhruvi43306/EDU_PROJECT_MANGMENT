using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace student_Project_Managment_System.Migrations
{
    /// <inheritdoc />
    public partial class overallgradees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OverallGrade",
                table: "StudentProjects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OverallGrade",
                table: "StudentProjects");
        }
    }
}
