# Inventory & Order Management System

A full-stack containerized application for managing products, customers, and orders with real-time inventory tracking.

## Tech Stack

- **Backend**: Python FastAPI
- **Frontend**: React.js
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Project Structure

```
.
├── backend/              # FastAPI backend application
├── frontend/             # React frontend application
├── docker-compose.yml    # Docker Compose configuration
├── .env.example          # Environment variables template
└── README.md
```

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git

### Development Setup

1. Clone the repository
```bash
git clone https://github.com/Krishna0812478/inventory-order-management.git
cd inventory-order-management
```

2. Create environment file
```bash
cp .env.example .env
```

3. Start all services
```bash
docker-compose up --build
```

4. Access the application
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs

## Project Features

### Product Management
- ✅ Create, Read, Update, Delete products
- ✅ Unique SKU/Code validation
- ✅ Real-time inventory tracking

### Customer Management
- ✅ Create, Read, Delete customers
- ✅ Unique email validation
- ✅ Contact information storage

### Order Management
- ✅ Create orders with inventory validation
- ✅ Automatic stock reduction
- ✅ Order tracking and history
- ✅ Automatic total calculation

### Dashboard
- ✅ Summary statistics
- ✅ Low stock alerts
- ✅ Order overview

## API Documentation

Once running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## Deployment

- **Backend**: Render, Railway, or Fly.io
- **Frontend**: Vercel or Netlify
- **Database**: PostgreSQL (cloud-hosted)

## Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
