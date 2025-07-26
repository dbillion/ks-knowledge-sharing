# 👩‍💻 Developer Guide

## Getting Started

Welcome to the KS Knowledge Sharing Platform development guide! This document will help you understand the codebase and start contributing.

## Architecture Overview

The platform follows a modular Node.js architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │  External APIs  │    │   Admin Panel   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────┐
         │                API Gateway                      │
         └─────────────────────────────────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────┐
         │              Express.js Server                  │
         │  ┌─────────────┐ ┌─────────────┐ ┌───────────┐  │
         │  │ Controllers │ │ Middleware  │ │  Routes   │  │
         │  └─────────────┘ └─────────────┘ └───────────┘  │
         │  ┌─────────────┐ ┌─────────────┐ ┌───────────┐  │
         │  │   Models    │ │   Utils     │ │  Config   │  │
         │  └─────────────┘ └─────────────┘ └───────────┘  │
         └─────────────────────────────────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────┐
         │                 Database                        │
         └─────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── index.js           # Application entry point
├── controllers/       # Request handlers
│   ├── auth.js       # Authentication logic
│   ├── users.js      # User management
│   └── knowledge.js  # Knowledge base operations
├── models/            # Data models
│   ├── User.js       # User model
│   └── Article.js    # Article model
├── routes/            # Route definitions
│   ├── api.js        # API routes
│   └── auth.js       # Authentication routes
├── middleware/        # Custom middleware
│   ├── auth.js       # Authentication middleware
│   ├── validation.js # Input validation
│   └── logging.js    # Request logging
├── utils/             # Utility functions
│   ├── crypto.js     # Cryptographic functions
│   ├── email.js      # Email utilities
│   └── logger.js     # Logging utilities
└── config/            # Configuration files
    ├── database.js   # Database configuration
    └── app.js        # Application configuration
```

## Development Workflow

### 1. Setting Up

```bash
# Clone and setup
git clone https://github.com/dbillion/ks-knowledge-sharing.git
cd ks-knowledge-sharing
npm install
cp .env.example .env

# Start development
npm run dev
```

### 2. Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write tests first** (TDD approach)
   ```bash
   npm run test:watch
   ```

3. **Implement your feature**
   - Follow the existing code patterns
   - Add proper error handling
   - Include JSDoc comments

4. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature-name
   ```

### 3. Code Review Process

- All changes require a pull request
- At least one approval from maintainers
- All CI checks must pass
- Code coverage must meet thresholds

## Coding Standards

### JavaScript Style

```javascript
// Use async/await for asynchronous operations
async function getUserById(id) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    logger.error('Failed to get user', { id, error });
    throw new Error('User not found');
  }
}

// Use descriptive variable names
const authenticatedUser = await authenticateUser(token);

// Add JSDoc comments for functions
/**
 * Creates a new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email address
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} Created user object
 */
async function createUser(userData) {
  // Implementation
}
```

### Error Handling

```javascript
// Use custom error classes
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Consistent error responses
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      field: err.field
    });
  }
  
  // Handle other errors...
});
```

### Database Operations

```javascript
// Use models for database operations
const User = {
  async create(userData) {
    // Database creation logic
  },
  
  async findById(id) {
    // Database query logic
  }
};
```

## Testing Strategy

### Unit Tests

Test individual functions and components:

```javascript
describe('getUserById', () => {
  it('should return user when found', async () => {
    // Arrange
    const userId = '123';
    const expectedUser = { id: userId, name: 'John' };
    
    // Act
    const result = await getUserById(userId);
    
    // Assert
    expect(result).toEqual(expectedUser);
  });
});
```

### Integration Tests

Test API endpoints and database interactions:

```javascript
describe('POST /api/users', () => {
  it('should create new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
      
    expect(response.body.email).toBe(userData.email);
  });
});
```

## Database Guidelines

### Schema Design

- Use consistent naming conventions
- Add proper indexes for performance
- Include timestamps (createdAt, updatedAt)
- Implement soft deletes where appropriate

### Migrations

- Always create reversible migrations
- Test migrations on sample data
- Include seed data for development

## Security Best Practices

### Input Validation

```javascript
const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Za-z])(?=.*\d)/),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

### Authentication

- Use JWT tokens for stateless authentication
- Implement refresh token rotation
- Add rate limiting for auth endpoints

### Authorization

- Implement role-based access control (RBAC)
- Check permissions at route level
- Validate resource ownership

## Performance Optimization

### Caching

- Implement Redis for session storage
- Cache frequently accessed data
- Use appropriate cache expiration

### Database Optimization

- Use database indexes effectively
- Implement query optimization
- Monitor slow queries

### Monitoring

- Implement logging with structured data
- Add performance metrics
- Set up alerting for errors

## Deployment

### Environment Configuration

```bash
# Production environment variables
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
```

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Debugging

### Local Development

```bash
# Debug mode
npm run dev -- --inspect

# Debug tests
npm run test -- --inspect-brk
```

### Production Debugging

- Use structured logging
- Implement health checks
- Add metrics collection

## Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/guide/)
- [Jest Testing Framework](https://jestjs.io/)
- [API Design Guide](https://github.com/microsoft/api-guidelines)

## Getting Help

- Check existing documentation
- Search through GitHub issues
- Ask in GitHub Discussions
- Contact the development team

Happy coding! 🚀