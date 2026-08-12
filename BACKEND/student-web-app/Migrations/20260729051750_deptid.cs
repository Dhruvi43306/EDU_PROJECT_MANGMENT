using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace student_Project_Managment_System.Migrations
{
    /// <inheritdoc />
    public partial class deptid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "StudentProjects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_StudentProjects_DepartmentId",
                table: "StudentProjects",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentProjects_Departmnets_DepartmentId",
                table: "StudentProjects",
                column: "DepartmentId",
                principalTable: "Departmnets",
                principalColumn: "DepartmentId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentProjects_Departmnets_DepartmentId",
                table: "StudentProjects");

            migrationBuilder.DropIndex(
                name: "IX_StudentProjects_DepartmentId",
                table: "StudentProjects");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "StudentProjects");
        }
    }
}
