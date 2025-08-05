using System.Linq.Expressions;
using System.Text.Json.Serialization;

namespace HahnTaskManager.Application
{
    public class BaseQuery<T>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public List<FilterCondition> Filters { get; set; } = new();
        public List<SortCondition> Sorts { get; set; } = new();

        public IQueryable<T> Apply(IQueryable<T> queryable)
        {
            queryable = ApplyFilters(queryable);
            queryable = ApplySorting(queryable);
            queryable = queryable
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize);

            return queryable;
        }

        private IQueryable<T> ApplyFilters(IQueryable<T> queryable)
        {
            foreach (var filter in Filters)
            {
                var parameter = Expression.Parameter(typeof(T), "x");
                var property = Expression.Property(parameter, filter.PropertyName);
                object value;
                if (property.Type.IsEnum)
                {
                    // Handle enum conversion
                    value = Enum.Parse(property.Type, filter.Value);
                }
                else if (property.Type == typeof(DateTime) || property.Type == typeof(DateTime?))
                {
                    if (DateTime.TryParse(filter.Value.ToString(), out var dateValue))
                    {
                        value = dateValue;
                    }
                    else
                    {
                        throw new FormatException($"Value '{filter.Value}' is not a valid DateTime.");
                    }
                }
                else
                {
                    value = Convert.ChangeType(filter.Value, property.Type);
                }
                var constant = Expression.Constant(value);
                Expression? body = filter.Operator switch
                {
                    FilterOperator.Equals => Expression.Equal(property, constant),
                    FilterOperator.NotEquals => Expression.NotEqual(property, constant),
                    FilterOperator.GreaterThan => Expression.GreaterThan(property, constant),
                    FilterOperator.GreaterThanOrEqual => Expression.GreaterThanOrEqual(property, constant),
                    FilterOperator.LessThan => Expression.LessThan(property, constant),
                    FilterOperator.LessThanOrEqual => Expression.LessThanOrEqual(property, constant),
                    FilterOperator.Contains => Expression.Call(property, nameof(string.Contains), null, constant),
                    FilterOperator.StartsWith => Expression.Call(property, nameof(string.StartsWith), null, constant),
                    FilterOperator.EndsWith => Expression.Call(property, nameof(string.EndsWith), null, constant),
                    _ => null
                };

                if (body != null)
                {
                    var lambda = Expression.Lambda<Func<T, bool>>(body, parameter);
                    queryable = queryable.Where(lambda);
                }
            }

            return queryable;
        }

        private IQueryable<T> ApplySorting(IQueryable<T> queryable)
        {
            bool isFirst = true;

            foreach (var sort in Sorts)
            {
                var parameter = Expression.Parameter(typeof(T), "x");
                var property = Expression.Property(parameter, sort.PropertyName);
                var lambda = Expression.Lambda(property, parameter);

                string methodName = isFirst
                    ? (sort.Direction == SortDirection.Ascending ? "OrderBy" : "OrderByDescending")
                    : (sort.Direction == SortDirection.Ascending ? "ThenBy" : "ThenByDescending");

                var method = typeof(Queryable).GetMethods()
                    .Where(m => m.Name == methodName && m.GetParameters().Length == 2)
                    .Single()
                    .MakeGenericMethod(typeof(T), property.Type);

                queryable = (IQueryable<T>)method.Invoke(null, new object[] { queryable, lambda })!;
                isFirst = false;
            }

            return queryable;
        }
    }
    public enum FilterOperator
    {
        Equals,
        NotEquals,
        Contains,
        StartsWith,
        EndsWith,
        GreaterThan,
        GreaterThanOrEqual,
        LessThan,
        LessThanOrEqual
    }

    public class FilterCondition
    {
        [JsonPropertyName("propertyName")]
        public string PropertyName { get; set; } = null!;

        [JsonPropertyName("opertator")]
        public FilterOperator Operator { get; set; }

        [JsonPropertyName("value")]
        public string? Value { get; set; } = null!;
    }

    public enum SortDirection
    {
        Ascending,
        Descending
    }

    public class SortCondition
    {
        [JsonPropertyName("propertyName")]
        public string PropertyName { get; set; } = null!;

        [JsonPropertyName("direction")]
        public SortDirection Direction { get; set; } = SortDirection.Ascending;
    }

}
