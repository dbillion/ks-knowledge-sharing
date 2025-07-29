# NestJS Knowledge Sharing API - Implementation Plan

## Project Overview
A comprehensive NestJS backend API that serves the Angular Knowledge Sharing frontend application. This API replaces the current mock services with real database-backed endpoints using SQLite for development (easily upgradable to PostgreSQL for production).

## Architecture Overview

### 1. Technology Stack
- **Framework**: NestJS 10+ with TypeScript
- **Database**: SQLite (development) → PostgreSQL (production)
- **ORM**: TypeORM for database operations
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest for unit/integration tests
- **Caching**: Redis (optional for production)
- **File Storage**: Local filesystem (development) → AWS S3 (production)

### 2. Project Structure
```
knowledge-sharing-api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── swagger.config.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── dto/
│   │   │   ├── pagination.dto.ts
│   │   │   └── base-response.dto.ts
│   │   └── enums/
│   │       ├── user-role.enum.ts
│   │       └── article-status.enum.ts
│   ├── database/
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── article.entity.ts
│   │   │   ├── category.entity.ts
│   │   │   ├── tag.entity.ts
│   │   │   ├── version.entity.ts
│   │   │   ├── comment.entity.ts
│   │   │   └── attachment.entity.ts
│   │   ├── migrations/
│   │   └── seeds/
│   │       └── initial-seed.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       ├── register.dto.ts
│   │   │       └── auth-response.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       └── user-response.dto.ts
│   │   ├── articles/
│   │   │   ├── articles.module.ts
│   │   │   ├── articles.controller.ts
│   │   │   ├── articles.service.ts
│   │   │   └── dto/
│   │   │       ├── create-article.dto.ts
│   │   │       ├── update-article.dto.ts
│   │   │       ├── article-response.dto.ts
│   │   │       └── article-query.dto.ts
│   │   ├── categories/
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── dto/
│   │   │       ├── create-category.dto.ts
│   │   │       ├── update-category.dto.ts
│   │   │       └── category-response.dto.ts
│   │   ├── search/
│   │   │   ├── search.module.ts
│   │   │   ├── search.controller.ts
│   │   │   ├── search.service.ts
│   │   │   └── dto/
│   │   │       ├── search-query.dto.ts
│   │   │       └── search-response.dto.ts
│   │   ├── uploads/
│   │   │   ├── uploads.module.ts
│   │   │   ├── uploads.controller.ts
│   │   │   ├── uploads.service.ts
│   │   │   └── dto/
│   │   │       └── upload-response.dto.ts
│   │   └── health/
│   │       ├── health.module.ts
│   │       └── health.controller.ts
│   └── utils/
│       ├── password.util.ts
│       ├── slug.util.ts
│       └── pagination.util.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── uploads/ (local development)
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

## 3. Database Design

### 3.1 Core Entities

#### User Entity
```typescript
export class User {
  id: string; // UUID primary key
  username: string; // unique
  email: string; // unique
  firstName: string;
  lastName: string;
  password: string; // hashed with bcrypt
  role: UserRole; // enum: admin, editor, viewer
  avatar?: string; // file path or URL
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  articles: Article[];
  comments: Comment[];
  versions: Version[];
}
```

#### Article Entity
```typescript
export class Article {
  id: string; // UUID primary key
  title: string;
  content: string; // Rich text content
  excerpt?: string; // Auto-generated or manual
  slug: string; // URL-friendly identifier
  status: ArticleStatus; // draft, published, archived
  viewCount: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  authorId: string;
  author: User;
  categoryId: string;
  category: Category;
  tags: Tag[];
  versions: Version[];
  comments: Comment[];
  attachments: Attachment[];
}
```

#### Category Entity
```typescript
export class Category {
  id: string; // UUID primary key
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Self-referencing for hierarchy
  parentId?: string;
  parent?: Category;
  children: Category[];
  
  // Relations
  articles: Article[];
}
```

#### Tag Entity
```typescript
export class Tag {
  id: string; // UUID primary key
  name: string;
  slug: string;
  color?: string;
  usageCount: number; // Denormalized for performance
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  articles: Article[];
}
```

#### Version Entity
```typescript
export class Version {
  id: string; // UUID primary key
  versionNumber: number;
  title: string;
  content: string;
  changeSummary?: string;
  createdAt: Date;
  
  // Relations
  articleId: string;
  article: Article;
  authorId: string;
  author: User;
}
```

#### Comment Entity
```typescript
export class Comment {
  id: string; // UUID primary key
  content: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  articleId: string;
  article: Article;
  authorId: string;
  author: User;
  parentId?: string; // For nested comments
  parent?: Comment;
  replies: Comment[];
}
```

#### Attachment Entity
```typescript
export class Attachment {
  id: string; // UUID primary key
  originalName: string;
  filename: string; // stored filename
  mimetype: string;
  size: number;
  path: string; // storage path
  downloadCount: number;
  createdAt: Date;
  
  // Relations
  articleId: string;
  article: Article;
  uploadedById: string;
  uploadedBy: User;
}
```

### 3.2 Database Configuration

#### SQLite Configuration (Development)
```typescript
// database.config.ts
export const databaseConfig = {
  development: {
    type: 'sqlite',
    database: 'knowledge_sharing.db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // Only for development
    logging: true,
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    seeds: [__dirname + '/../database/seeds/*{.ts,.js}']
  }
};
```

#### PostgreSQL Configuration (Production)
```typescript
export const databaseConfig = {
  production: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // Never in production
    logging: false,
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    ssl: process.env.NODE_ENV === 'production'
  }
};
```

## 4. API Endpoints Specification

### 4.1 Authentication Endpoints
```
POST   /api/auth/register      - User registration
POST   /api/auth/login         - User login
POST   /api/auth/logout        - User logout
POST   /api/auth/refresh       - Refresh JWT token
POST   /api/auth/forgot        - Password reset request
POST   /api/auth/reset         - Password reset confirmation
GET    /api/auth/profile       - Get current user profile
PUT    /api/auth/profile       - Update current user profile
```

### 4.2 User Management Endpoints
```
GET    /api/users              - Get all users (admin only)
GET    /api/users/:id          - Get user by ID
POST   /api/users              - Create new user (admin only)
PUT    /api/users/:id          - Update user (admin/self only)
DELETE /api/users/:id          - Delete user (admin only)
PUT    /api/users/:id/status   - Activate/deactivate user (admin only)
```

### 4.3 Article Endpoints
```
GET    /api/articles           - Get articles (with pagination & filters)
GET    /api/articles/:id       - Get article by ID
POST   /api/articles           - Create new article
PUT    /api/articles/:id       - Update article
DELETE /api/articles/:id       - Delete article
PATCH  /api/articles/:id/publish - Publish/unpublish article
GET    /api/articles/:id/versions - Get article version history
POST   /api/articles/:id/versions - Create new version
GET    /api/articles/category/:categoryId - Get articles by category
GET    /api/articles/author/:authorId - Get articles by author
GET    /api/articles/published - Get only published articles
PUT    /api/articles/:id/view  - Increment view count
```

### 4.4 Category Endpoints
```
GET    /api/categories         - Get all categories (hierarchical)
GET    /api/categories/:id     - Get category by ID
POST   /api/categories         - Create new category
PUT    /api/categories/:id     - Update category
DELETE /api/categories/:id     - Delete category
GET    /api/categories/:id/articles - Get articles in category
GET    /api/categories/tree    - Get category tree structure
```

### 4.5 Search Endpoints
```
GET    /api/search             - Search articles
GET    /api/search/suggestions - Get search suggestions
GET    /api/search/filters     - Get available search filters
POST   /api/search/saved       - Save search query
GET    /api/search/saved       - Get saved searches
DELETE /api/search/saved/:id   - Delete saved search
```

### 4.6 Tag Endpoints
```
GET    /api/tags               - Get all tags
GET    /api/tags/:id           - Get tag by ID
POST   /api/tags               - Create new tag
PUT    /api/tags/:id           - Update tag
DELETE /api/tags/:id           - Delete tag
GET    /api/tags/popular       - Get most used tags
```

### 4.7 Upload Endpoints
```
POST   /api/uploads/image      - Upload image file
POST   /api/uploads/document   - Upload document file
GET    /api/uploads/:filename  - Get uploaded file
DELETE /api/uploads/:id        - Delete uploaded file
```

### 4.8 Comment Endpoints
```
GET    /api/articles/:id/comments - Get article comments
POST   /api/articles/:id/comments - Add comment to article
PUT    /api/comments/:id          - Update comment
DELETE /api/comments/:id          - Delete comment
```

## 5. Data Transfer Objects (DTOs)

### 5.1 Authentication DTOs
```typescript
// Login DTO
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// Register DTO
export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;
}

// Auth Response DTO
export class AuthResponseDto {
  user: UserResponseDto;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
```

### 5.2 Article DTOs
```typescript
// Create Article DTO
export class CreateArticleDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

// Article Query DTO
export class ArticleQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  publishedOnly?: boolean;

  @IsOptional()
  @IsIn(['title', 'createdAt', 'updatedAt', 'viewCount'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: string = 'DESC';
}
```

### 5.3 Search DTOs
```typescript
// Search Query DTO
export class SearchQueryDto {
  @IsString()
  @MinLength(1)
  q: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  publishedOnly?: boolean = true;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;
}

// Search Response DTO
export class SearchResponseDto {
  articles: ArticleResponseDto[];
  totalCount: number;
  queryTime: number;
  suggestions: string[];
  filters: {
    categories: CategoryResponseDto[];
    tags: string[];
    dateRange: {
      min: Date;
      max: Date;
    };
  };
}
```

## 6. Service Implementation Strategy

### 6.1 Authentication Service
```typescript
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user exists
    // Hash password
    // Create user entity
    // Generate JWT tokens
    // Return response
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Validate credentials
    // Generate JWT tokens
    // Update last login
    // Return response
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    // Validate JWT payload
    // Return user if valid
  }
}
```

### 6.2 Articles Service
```typescript
@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) {}

  async findAll(queryDto: ArticleQueryDto): Promise<PaginatedResponse<Article>> {
    // Build query with filters
    // Apply pagination
    // Include relations
    // Return paginated results
  }

  async findOne(id: string): Promise<Article> {
    // Find article by ID
    // Include relations
    // Increment view count
    // Return article
  }

  async create(userId: string, createDto: CreateArticleDto): Promise<Article> {
    // Create article entity
    // Handle tags (create if new)
    // Generate slug
    // Set author
    // Save article
  }

  async update(id: string, userId: string, updateDto: UpdateArticleDto): Promise<Article> {
    // Check permissions
    // Update article
    // Handle tag changes
    // Create new version if published
    // Return updated article
  }
}
```

### 6.3 Search Service
```typescript
@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>
  ) {}

  async search(searchDto: SearchQueryDto): Promise<SearchResponseDto> {
    const startTime = Date.now();
    
    // Build search query
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags');

    // Apply text search
    if (searchDto.q) {
      queryBuilder.andWhere(
        '(article.title ILIKE :search OR article.content ILIKE :search OR article.excerpt ILIKE :search)',
        { search: `%${searchDto.q}%` }
      );
    }

    // Apply filters
    if (searchDto.categories?.length) {
      queryBuilder.andWhere('article.categoryId IN (:...categories)', 
        { categories: searchDto.categories });
    }

    if (searchDto.publishedOnly) {
      queryBuilder.andWhere('article.status = :status', { status: 'published' });
    }

    // Apply pagination
    const [articles, totalCount] = await queryBuilder
      .skip((searchDto.page - 1) * searchDto.limit)
      .take(searchDto.limit)
      .getManyAndCount();

    const queryTime = Date.now() - startTime;

    return {
      articles,
      totalCount,
      queryTime,
      suggestions: await this.generateSuggestions(searchDto.q),
      filters: await this.getAvailableFilters()
    };
  }
}
```

## 7. Security Implementation

### 7.1 JWT Configuration
```typescript
// jwt.config.ts
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '1h',
  },
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshOptions: {
    expiresIn: '7d',
  },
};
```

### 7.2 Guards and Decorators
```typescript
// JWT Auth Guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Roles Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return requiredRoles.some((role) => user.role === role);
  }
}

// Roles Decorator
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

### 7.3 Password Security
```typescript
// password.util.ts
export class PasswordUtil {
  static async hash(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static validate(password: string): boolean {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }
}
```

## 8. File Upload Implementation

### 8.1 Upload Configuration
```typescript
// uploads.module.ts
@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        // Allow only specific file types
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedTypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
```

### 8.2 Upload Service
```typescript
@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>
  ) {}

  async uploadFile(file: Express.Multer.File, userId: string, articleId?: string): Promise<Attachment> {
    // Generate unique filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    
    // Move file to proper location
    const uploadPath = path.join('./uploads', filename);
    await fs.promises.rename(file.path, uploadPath);

    // Create attachment record
    const attachment = this.attachmentRepository.create({
      originalName: file.originalname,
      filename,
      mimetype: file.mimetype,
      size: file.size,
      path: uploadPath,
      uploadedById: userId,
      articleId,
    });

    return this.attachmentRepository.save(attachment);
  }
}
```

## 9. Testing Strategy

### 9.1 Unit Tests
```typescript
// Example: auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should create a new user', async () => {
      // Test implementation
    });

    it('should throw error for duplicate email', async () => {
      // Test implementation
    });
  });
});
```

### 9.2 Integration Tests
```typescript
// Example: articles.e2e-spec.ts
describe('ArticlesController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = loginResponse.body.access_token;
  });

  it('/articles (GET)', () => {
    return request(app.getHttpServer())
      .get('/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('meta');
      });
  });
});
```

## 10. Database Migration & Seeding

### 10.1 Initial Migration
```typescript
// 1234567890123-CreateInitialTables.ts
export class CreateInitialTables1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'username', type: 'varchar', isUnique: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'firstName', type: 'varchar' },
          { name: 'lastName', type: 'varchar' },
          { name: 'password', type: 'varchar' },
          { name: 'role', type: 'enum', enum: ['admin', 'editor', 'viewer'], default: "'viewer'" },
          { name: 'avatar', type: 'varchar', isNullable: true },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'emailVerified', type: 'boolean', default: false },
          { name: 'lastLoginAt', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true
    );
    
    // Create other tables...
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
    // Drop other tables...
  }
}
```

### 10.2 Seed Data
```typescript
// initial-seed.ts
export class InitialSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const categoryRepository = dataSource.getRepository(Category);
    const articleRepository = dataSource.getRepository(Article);

    // Create admin user
    const adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@knowledge.com',
      firstName: 'Admin',
      lastName: 'User',
      password: await PasswordUtil.hash('password123'),
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
    });
    await userRepository.save(adminUser);

    // Create categories
    const categories = [
      { name: 'Development', slug: 'development', description: 'Software development articles' },
      { name: 'Design', slug: 'design', description: 'UI/UX design resources' },
      { name: 'DevOps', slug: 'devops', description: 'DevOps and infrastructure' },
    ];

    for (const categoryData of categories) {
      const category = categoryRepository.create(categoryData);
      await categoryRepository.save(category);
    }

    // Create sample articles
    const developmentCategory = await categoryRepository.findOne({ where: { slug: 'development' } });
    
    const sampleArticle = articleRepository.create({
      title: 'Getting Started with NestJS',
      content: '<p>NestJS is a progressive Node.js framework...</p>',
      excerpt: 'Learn the basics of NestJS framework',
      slug: 'getting-started-with-nestjs',
      status: ArticleStatus.PUBLISHED,
      author: adminUser,
      category: developmentCategory,
      publishedAt: new Date(),
    });
    await articleRepository.save(sampleArticle);
  }
}
```

## 11. Environment Configuration

### 11.1 Environment Variables
```bash
# .env.example
NODE_ENV=development
PORT=3000

# Database Configuration
DB_TYPE=sqlite
DB_DATABASE=knowledge_sharing.db

# For PostgreSQL (production)
# DB_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=knowledge_user
# DB_PASSWORD=secure_password
# DB_NAME=knowledge_sharing

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DEST=./uploads
MAX_FILE_SIZE=10485760

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AWS S3 Configuration (production)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=knowledge-sharing-uploads

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Configuration
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:4200
CORS_ORIGINS=http://localhost:4200,https://your-domain.com
```

## 12. API Documentation with Swagger

### 12.1 Swagger Configuration
```typescript
// swagger.config.ts
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Knowledge Sharing API')
    .setDescription('A comprehensive knowledge sharing platform API')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('articles', 'Article management')
    .addTag('categories', 'Category management')
    .addTag('search', 'Search functionality')
    .addTag('uploads', 'File upload endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
```

### 12.2 API Documentation Examples
```typescript
// articles.controller.ts
@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async findAll(@Query() query: ArticleQueryDto): Promise<PaginatedResponse<Article>> {
    return this.articlesService.findAll(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBody({ type: CreateArticleDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: User,
    @Body() createArticleDto: CreateArticleDto
  ): Promise<Article> {
    return this.articlesService.create(user.id, createArticleDto);
  }
}
```

## 13. Performance Optimization

### 13.1 Caching Strategy
```typescript
// Cache configuration
@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5 minutes
      max: 100, // maximum number of items in cache
    }),
  ],
})
export class AppModule {}

// Service with caching
@Injectable()
export class ArticlesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @CacheKey('published-articles')
  @CacheTTL(600) // 10 minutes
  async getPublishedArticles(): Promise<Article[]> {
    return this.articleRepository.find({
      where: { status: ArticleStatus.PUBLISHED },
      relations: ['author', 'category', 'tags'],
      order: { createdAt: 'DESC' },
    });
  }
}
```

### 13.2 Database Optimization
```typescript
// Repository with optimized queries
@Injectable()
export class ArticlesService {
  async findAllOptimized(queryDto: ArticleQueryDto): Promise<PaginatedResponse<Article>> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .loadRelationCountAndMap('article.commentCount', 'article.comments')
      .loadRelationCountAndMap('article.tagCount', 'article.tags');

    // Use indexes for better performance
    if (queryDto.search) {
      queryBuilder.addSelect(
        `ts_rank(to_tsvector('english', article.title || ' ' || article.content), plainto_tsquery('english', :search))`,
        'rank'
      );
      queryBuilder.where(
        `to_tsvector('english', article.title || ' ' || article.content) @@ plainto_tsquery('english', :search)`,
        { search: queryDto.search }
      );
      queryBuilder.orderBy('rank', 'DESC');
    }

    // Efficient pagination
    const [articles, totalCount] = await queryBuilder
      .skip((queryDto.page - 1) * queryDto.limit)
      .take(queryDto.limit)
      .getManyAndCount();

    return {
      data: articles,
      meta: {
        totalCount,
        page: queryDto.page,
        limit: queryDto.limit,
        totalPages: Math.ceil(totalCount / queryDto.limit),
      },
    };
  }
}
```

## 14. Error Handling & Logging

### 14.1 Global Exception Filter
```typescript
// http-exception.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        errors = (exceptionResponse as any).errors || null;
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      errors = exception.constraints;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errors && { errors }),
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      exception instanceof Error ? exception.stack : 'Unknown error'
    );

    response.status(status).json(errorResponse);
  }
}
```

### 14.2 Logging Interceptor
```typescript
// logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${delay}ms`
        );
      }),
      catchError((error) => {
        const delay = Date.now() - now;
        this.logger.error(
          `${method} ${url} - ${delay}ms`,
          error.message,
          error.stack
        );
        throw error;
      })
    );
  }
}
```

## 15. Deployment Configuration

### 15.1 Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=development
COPY . .
RUN npm run build

FROM node:18-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
```

### 15.2 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: .
      target: development
    container_name: knowledge-sharing-api
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - DB_TYPE=postgres
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=password
      - DB_NAME=knowledge_sharing
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
      - ./uploads:/usr/src/app/uploads
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    container_name: knowledge-sharing-db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=knowledge_sharing
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  redis:
    image: redis:7-alpine
    container_name: knowledge-sharing-redis
    restart: unless-stopped
    ports:
      - '6379:6379'

volumes:
  postgres_data:
```

## 16. Implementation Phases

### Phase 1: Foundation Setup (Week 1)
- [x] Project initialization with NestJS CLI
- [x] Basic module structure
- [x] Database configuration (SQLite)
- [x] TypeORM entity definitions
- [x] Basic authentication module
- [ ] JWT strategy implementation
- [ ] User registration/login endpoints
- [ ] Basic error handling and logging

### Phase 2: Core API Development (Week 2-3)
- [ ] User management module
- [ ] Article CRUD operations
- [ ] Category management
- [ ] Tag system implementation
- [ ] File upload functionality
- [ ] Basic validation and DTOs
- [ ] Unit tests for services

### Phase 3: Advanced Features (Week 4)
- [ ] Search functionality implementation
- [ ] Advanced filtering and pagination
- [ ] Article versioning system
- [ ] Comment system
- [ ] Role-based access control
- [ ] API documentation with Swagger

### Phase 4: Performance & Security (Week 5)
- [ ] Caching implementation
- [ ] Database query optimization
- [ ] Security hardening
- [ ] Rate limiting
- [ ] Input validation enhancement
- [ ] Integration tests

### Phase 5: Production Readiness (Week 6)
- [ ] PostgreSQL migration scripts
- [ ] Docker containerization
- [ ] Environment configuration
- [ ] Monitoring and health checks
- [ ] Production deployment setup
- [ ] Performance testing

## 17. API Migration from Mock to Real

### 17.1 Frontend Service Updates Required
The existing Angular services will need minimal changes since they're already structured for HTTP API calls:

```typescript
// Before (Mock)
getArticles(): Observable<SimpleArticle[]> {
  return of(this.mockArticles()).pipe(delay(500));
}

// After (Real API)
getArticles(params: ArticleQueryDto = {}): Observable<PaginatedResponse<Article>> {
  return this.http.get<PaginatedResponse<Article>>('/api/articles', { params });
}
```

### 17.2 API Response Format Standardization
```typescript
// Standard API Response Format
export interface ApiResponse<T> {
  data: T;
  meta?: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  timestamp: string;
}

// Error Response Format
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  errors?: Record<string, string[]>;
}
```

## 18. Success Metrics & Testing

### 18.1 Performance Targets
- API response time < 200ms for simple queries
- Search response time < 500ms
- Database query optimization for <50ms average
- Support for 1000+ concurrent users
- 99.9% uptime

### 18.2 Security Checklist
- [ ] JWT token validation
- [ ] Rate limiting implementation
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection headers
- [ ] CORS configuration
- [ ] Password hashing with bcrypt
- [ ] Secure file upload handling

### 18.3 Quality Assurance
- [ ] 90%+ code coverage
- [ ] All endpoints tested
- [ ] API documentation complete
- [ ] Database migrations tested
- [ ] Error handling verified
- [ ] Security scan passed

## Conclusion

This comprehensive NestJS API implementation plan provides a solid foundation for replacing the mock Angular services with a robust, scalable, and secure backend. The modular architecture allows for easy maintenance and future enhancements, while the SQLite-to-PostgreSQL migration path ensures smooth development-to-production transitions.

The API is designed to closely match the existing Angular service interfaces, minimizing frontend changes while providing enhanced functionality, better performance, and real data persistence.
