using Microsoft.EntityFrameworkCore.Migrations;

namespace CoreDatabase.Migrations
{
    public partial class Tasks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TaskName",
                table: "TaskModels",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TaskName",
                table: "TaskModels");
        }
    }
}
