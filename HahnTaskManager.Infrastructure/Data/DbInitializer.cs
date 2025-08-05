using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskManager.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task Initialize(
        AppDbContext context,
        UserManager<User> userManager,
        RoleManager<IdentityRole<Guid>> roleManager)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Seed roles
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole<Guid>("Admin"));

        if (!await roleManager.RoleExistsAsync("User"))
            await roleManager.CreateAsync(new IdentityRole<Guid>("User"));

        // Seed admin user
        var adminEmail = "admin@taskmanager.com";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var admin = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                Position = "System Administrator",
                FirstName = "John",
                LastName = "Doe",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(admin, "Admin@1234!");
            if (result.Succeeded)
                await userManager.AddToRoleAsync(admin, "Admin");
        }

        // Seed regular users
        var regularUsers = new List<(string email, string position, string firstName, string lastName)>
        {
            ("dev1@taskmanager.com", "Developer", "Alice", "Smith"),
            ("dev2@taskmanager.com", "Developer", "Bob", "Johnson"),
            ("manager@taskmanager.com", "Project Manager", "Carol", "Williams")
        };

        foreach (var user in regularUsers)
        {
            if (await userManager.FindByEmailAsync(user.email) == null)
            {
                var newUser = new User
                {
                    UserName = user.email,
                    Email = user.email,
                    Position = user.position,
                    FirstName = user.firstName,
                    LastName = user.lastName,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(newUser, "P@ssword123");
                if (result.Succeeded)
                    await userManager.AddToRoleAsync(newUser, "User");
            }
        }

        // Seed work items if none exist
        if (!context.WorkItems.Any())
        {
            var users = await userManager.Users.ToListAsync();
            var random = new Random();

            var workItems = new List<WorkItem>
            {
                new() { Title = "Implement authentication", Description = "Set up JWT authentication", DueDate = DateTime.UtcNow.AddDays(7), Priority = Priority.High },
                new() { Title = "Create database schema", Description = "Design initial database structure", DueDate = DateTime.UtcNow.AddDays(3), Priority = Priority.Critical },
                new() { Title = "Write API documentation", Description = "Document all endpoints", DueDate = DateTime.UtcNow.AddDays(14), Priority = Priority.Medium },
                new() { Title = "Setup CI/CD pipeline", Description = "Configure GitHub Actions", DueDate = DateTime.UtcNow.AddDays(10), Priority = Priority.High },
                new() { Title = "Design UI mockups", Description = "Create Figma prototypes", DueDate = DateTime.UtcNow.AddDays(5), Priority = Priority.Low }
            };

            // Assign random users (excluding admin)
            var regularUserIds = users.Where(u => !u.Email.Equals(adminEmail)).Select(u => u.Id).ToList();

            foreach (var item in workItems)
            {
                if (regularUserIds.Any() && random.Next(2) == 1) // 50% chance of assignment
                {
                    item.AssigneeId = regularUserIds[random.Next(regularUserIds.Count)];
                }

                item.Status = (WorkItemStatus)random.Next(0, 3); // Random status
            }

            await context.WorkItems.AddRangeAsync(workItems);
            await context.SaveChangesAsync();
        }
    }
}