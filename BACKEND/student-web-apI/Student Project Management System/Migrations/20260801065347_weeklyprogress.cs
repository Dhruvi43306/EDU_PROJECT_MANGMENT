using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace student_Project_Managment_System.Migrations
{
    /// <inheritdoc />
    public partial class weeklyprogress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WeeklyProgresses",
                columns: table => new
                {
                    ProgressId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentProjectId = table.Column<int>(type: "int", nullable: false),
                    WeekNumber = table.Column<int>(type: "int", nullable: false),
                    WorkDone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Challenges = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NextPlan = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubmittedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Updated = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklyProgresses", x => x.ProgressId);
                    table.ForeignKey(
                        name: "FK_WeeklyProgresses_StatusMasters_StatusId",
                        column: x => x.StatusId,
                        principalTable: "StatusMasters",
                        principalColumn: "StatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WeeklyProgresses_StudentProjects_StudentProjectId",
                        column: x => x.StudentProjectId,
                        principalTable: "StudentProjects",
                        principalColumn: "StudnetProjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyProgresses_StatusId",
                table: "WeeklyProgresses",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyProgresses_StudentProjectId",
                table: "WeeklyProgresses",
                column: "StudentProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WeeklyProgresses");
        }
    }
}
