# SQL Editor

A powerful online SQL editor built with Next.js that allows you to create, manage, and execute SQL queries in a user-friendly interface similar to OneCompiler.

## Features

### Frontend
- **Modern UI**: Built with Next.js 14 (App Router) and Tailwind CSS for a responsive, professional interface
- **Playground Management**: Create, rename, and delete SQL playgrounds
- **Query Editor**: Syntax-highlighted SQL editor with a clean, intuitive interface
- **Results Display**: View query results in a well-formatted table with proper data type handling
- **Query History**: Keep track of all executed queries with success/error status
- **Loading States**: Smooth loading indicators and error handling throughout the app

### Backend
- **SQLite Database**: Lightweight, file-based database for storing playground metadata and query history
- **Sandboxed Execution**: Safe SQL query execution in an isolated environment
- **Sample Data**: Pre-populated with sample tables (users, orders) for testing queries
- **Query Safety**: Basic protection against potentially dangerous SQL operations
- **REST API**: Clean API endpoints for all CRUD operations

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, TypeScript
- **Backend**: Next.js API Routes, SQLite3, Node.js
- **Icons**: Lucide React
- **Database**: SQLite (file-based storage)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone or create the project directory**:
   ```bash
   mkdir sql-editor
   cd sql-editor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Project Structure

```
sql-editor/
├── app/
│   ├── api/
│   │   ├── playgrounds/
│   │   │   ├── [id]/
│   │   │   │   ├── history/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── execute/
│   │       └── route.ts
│   ├── playground/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── database.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── README.md
```

## Usage

### Creating a Playground

1. Click the "New Playground" button on the homepage
2. A new playground will be created with a default name
3. Click on the playground to open the SQL editor

### Writing and Executing Queries

1. Enter your SQL query in the editor
2. Click "Run Query" to execute
3. Results will appear in the table below
4. All queries are automatically saved to the history

### Sample Queries to Try

```sql
-- View all users
SELECT * FROM users;

-- Join users with their orders
SELECT u.name, u.email, o.product, o.amount 
FROM users u 
JOIN orders o ON u.id = o.user_id;

-- Aggregate data
SELECT u.name, COUNT(o.id) as order_count, SUM(o.amount) as total_spent
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id 
GROUP BY u.id, u.name;

-- Simple calculations
SELECT 'Hello' as greeting, 'World' as target, 42 as answer;
```

### Managing Playgrounds

- **Rename**: Click the edit icon next to any playground title
- **Delete**: Click the trash icon (with confirmation)
- **View History**: Click the "History" button in the playground editor

## API Endpoints

### Playgrounds
- `GET /api/playgrounds` - List all playgrounds
- `POST /api/playgrounds` - Create new playground
- `GET /api/playgrounds/[id]` - Get playground details
- `PUT /api/playgrounds/[id]` - Update playground
- `DELETE /api/playgrounds/[id]` - Delete playground

### Query Execution
- `POST /api/execute` - Execute SQL query

### Query History
- `GET /api/playgrounds/[id]/history` - Get query history for playground

## Database Schema

The application uses SQLite with the following tables:

### playgrounds
- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT)
- `created_at` (DATETIME)
- `last_modified` (DATETIME)

### query_history
- `id` (INTEGER PRIMARY KEY)
- `playground_id` (INTEGER, FOREIGN KEY)
- `query` (TEXT)
- `executed_at` (DATETIME)
- `success` (BOOLEAN)
- `error` (TEXT, nullable)

## Safety Features

- Queries are executed in an isolated, in-memory SQLite database
- Dangerous operations (DROP, DELETE, etc.) are blocked
- Only SELECT and safe operations are allowed by default
- Each query execution is sandboxed

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Customization

You can customize the application by:

1. **Adding more sample data**: Modify the `executeQuery` method in `lib/database.ts`
2. **Styling**: Update Tailwind classes or modify `app/globals.css`
3. **Query safety**: Adjust the `isQuerySafe` function in `app/api/execute/route.ts`
4. **Database schema**: Add more tables or modify existing ones

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

If you encounter any issues or have questions, please create an issue in the repository or contact the development team.