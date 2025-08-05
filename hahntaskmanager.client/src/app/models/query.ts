export enum FilterOperator {
  Equals = 0,
  NotEquals = 1,
  Contains = 2,
  StartsWith = 3,
  EndsWith = 4,
  GreaterThan = 5,
  GreaterThanOrEqual = 6,
  LessThan = 7,
  LessThanOrEqual = 8
}

export interface FilterCondition {
  propertyName: string;
  operator: FilterOperator;
  value: string;
}

export enum SortDirection {
  Ascending = 0,
  Descending = 1
}

export interface SortCondition {
  propertyName: string;
  direction: SortDirection;
}

export interface GetWorkItemsQuery {
  pageNumber?: number;
  pageSize?: number;
  filters?: FilterCondition[];
  sorts?: SortCondition[];
}

// Keep the old name for backward compatibility
export interface WorkItemsQuery extends GetWorkItemsQuery {}
