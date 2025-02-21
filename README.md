# Traffic Violation Lookup App

A Next.js application for searching traffic violations by license plate number. Built with Next.js 14, Prisma, and Bootstrap.

## Features

- Search traffic violations by license plate number
- Real-time validation of license plate formats
- Per-user search history tracking
- Modern, responsive UI with Bootstrap
- SQLite database for storing search history

## Prerequisites

- Node.js 18.17 or later
- npm (Node Package Manager)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd phatnguoi
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   │   ├── history/     # Search history endpoints
│   │   └── search/      # License plate search endpoints
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── lib/                 # Library code
│   └── prisma.ts       # Prisma client configuration
├── prisma/             # Database configuration
│   └── schema.prisma   # Prisma schema
├── public/             # Static assets
├── utils/              # Utility functions
│   ├── user.ts        # User management
│   └── validation.ts  # License plate validation
└── package.json        # Project dependencies
```

## Deployment

This application can be deployed to any platform that supports Next.js applications. We recommend using Vercel for the easiest deployment experience.

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy your application

For other platforms, make sure to:
1. Set up the database connection
2. Run Prisma migrations
3. Configure environment variables if needed

## License

MIT License - feel free to use this code for your own projects.
