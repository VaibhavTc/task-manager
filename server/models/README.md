# Database Models

This directory will contain the database models for the application. The user will implement the actual database connection.

## Suggested Models

### User Model
```
{
  id: String (UUID),
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Task Model
```
{
  id: String (UUID),
  title: String,
  description: String,
  completed: Boolean,
  priority: Enum ('Low', 'Medium', 'High'),
  createdAt: Date,
  userId: String (foreign key to User)
}
```

## Integration Notes

When integrating with a real database:

1. Replace the in-memory arrays in the route files with proper database queries
2. Update the authentication middleware to verify users against the database
3. Implement proper error handling for database operations
4. Consider adding indexes for frequently queried fields (userId, etc.)