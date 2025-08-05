using System.ComponentModel.DataAnnotations;

namespace HahnTaskManager.Application.Validation
{
    public class FutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
            => value is DateTime date && date > DateTime.UtcNow;
    }
}
