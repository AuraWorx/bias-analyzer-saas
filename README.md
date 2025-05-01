# BiasAnalyzer SaaS Platform

A full-stack SaaS application for analyzing bias in data, built with Next.js, Python FastAPI, and PostgreSQL.

## Features

- User authentication and multi-tenant architecture
- Dashboard with analytics and reporting
- File upload (CSV, JSON) for bias analysis
- Comprehensive bias reports
- RESTful API for programmatic access

## Tech Stack

### Frontend
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Backend
- Python FastAPI
- SQLAlchemy ORM
- PostgreSQL database
- JWT authentication

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Docker and Docker Compose (optional)

### Running with Docker

The easiest way to get started is using Docker Compose:

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/bias-analyzer.git
cd bias-analyzer

# Start the application
docker-compose up -d
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup

#### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

#### Backend

\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up the database
# Update the database URL in database.py

# Start the server
uvicorn main:app --reload
\`\`\`

## Project Structure

\`\`\`
bias-analyzer/
├── frontend/                # Next.js frontend
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   └── public/              # Static assets
├── backend/                 # Python FastAPI backend
│   ├── main.py              # Main application entry
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   └── schemas.py           # Pydantic schemas
└── docker-compose.yml       # Docker Compose configuration
\`\`\`

## API Documentation

The API documentation is automatically generated and available at `/docs` when the backend is running.

## Multi-Tenant Architecture

The application is designed with multi-tenancy in mind:

- Each organization is a separate tenant
- Users belong to a tenant
- Data is isolated between tenants
- Database queries are filtered by tenant_id

## License

MIT
