using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace student_Project_Managment_System.Migrations
{
    /// <inheritdoc />
    public partial class removestudentdetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Studnets_Departmnets_DepartmentMasterDepartmentId",
                table: "Studnets");

            migrationBuilder.DropIndex(
                name: "IX_Studnets_DepartmentMasterDepartmentId",
                table: "Studnets");

            migrationBuilder.DropColumn(
                name: "Academicyear",
                table: "Studnets");

            migrationBuilder.DropColumn(
                name: "DepartmentMasterDepartmentId",
                table: "Studnets");

            migrationBuilder.DropColumn(
                name: "Enrollmentno",
                table: "Studnets");

            migrationBuilder.DropColumn(
                name: "Semester",
                table: "Studnets");

            migrationBuilder.DropColumn(
                name: "batch",
                table: "Studnets");

            migrationBuilder.DropColumn(
                name: "cpi",
                table: "Studnets");

            migrationBuilder.AddColumn<int>(
                name: "Academicyear",
                table: "StudentProjects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Enrollmentno",
                table: "StudentProjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Semester",
                table: "StudentProjects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "batch",
                table: "StudentProjects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<float>(
                name: "cpi",
                table: "StudentProjects",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Academicyear",
                table: "StudentProjects");

            migrationBuilder.DropColumn(
                name: "Enrollmentno",
                table: "StudentProjects");

            migrationBuilder.DropColumn(
                name: "Semester",
                table: "StudentProjects");

            migrationBuilder.DropColumn(
                name: "batch",
                table: "StudentProjects");

            migrationBuilder.DropColumn(
                name: "cpi",
                table: "StudentProjects");

            migrationBuilder.AddColumn<int>(
                name: "Academicyear",
                table: "Studnets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DepartmentMasterDepartmentId",
                table: "Studnets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Enrollmentno",
                table: "Studnets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Semester",
                table: "Studnets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "batch",
                table: "Studnets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<float>(
                name: "cpi",
                table: "Studnets",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.CreateIndex(
                name: "IX_Studnets_DepartmentMasterDepartmentId",
                table: "Studnets",
                column: "DepartmentMasterDepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Studnets_Departmnets_DepartmentMasterDepartmentId",
                table: "Studnets",
                column: "DepartmentMasterDepartmentId",
                principalTable: "Departmnets",
                principalColumn: "DepartmentId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
