using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace student_Project_Managment_System.Migrations
{
    /// <inheritdoc />
    public partial class removeoverallgrade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OverallGrade",
                table: "Evaluations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OverallGrade",
                table: "Evaluations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
