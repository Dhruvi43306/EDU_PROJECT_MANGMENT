using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace student_Project_Managment_System.Migrations
{
    /// <inheritdoc />
    public partial class aedduseridforstudnet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StudentName",
                table: "Studnets");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Studnets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Studnets_UserId",
                table: "Studnets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Studnets_Users_UserId",
                table: "Studnets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Studnets_Users_UserId",
                table: "Studnets");

            migrationBuilder.DropIndex(
                name: "IX_Studnets_UserId",
                table: "Studnets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Studnets");

            migrationBuilder.AddColumn<string>(
                name: "StudentName",
                table: "Studnets",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
