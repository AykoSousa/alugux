
# Alugux

A micro-saas developed and designed for you to have better management of your properties and rentals.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Monitoring](#monitoring)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Property Management:**
  - Create, edit and manage properties
  - Track property status (Available/Rented)
  - Monitor property pricing

- **Rental Management:**
  - Create and manage rental contracts
  - Track active tenants
  - Monitor rental payments
  - Manage rental periods

- **Dashboard:**
  - Real-time overview of your portfolio
  - Key metrics visualization
  - Monthly revenue tracking
  - Active contracts monitoring

## 🛠️ Tech Stack

- **Frontend:**
  - React + TypeScript
  - Vite
  - TanStack Query
  - Tailwind CSS
  - Shadcn/ui

- **Backend:**
  - Supabase
  - PostgreSQL
  - Edge Functions

- **Monitoring:**
  - Prometheus
  - Grafana
  - Nginx Exporter

## 🏗️ Architecture

The application follows a modern microservices architecture:

```
┌─────────────────┐     ┌──────────────┐
│     Frontend    │────▶│    Nginx     │
└─────────────────┘     └──────┬───────┘
                              │
                        ┌─────▼──────┐
                        │ Prometheus │
                        └─────┬──────┘
                              │
                        ┌─────▼──────┐
                        │  Grafana   │
                        └────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Docker
- Docker Compose
- Node.js 20.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/alugux.git
cd alugux
```

2. Start the application:
```bash
docker compose up -d
```

3. The application will be available at:
   - Frontend: http://localhost:8080
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000 (default credentials: admin/admin)

## 📊 Monitoring

### Available Metrics

The application exposes metrics through various endpoints:

- `/metrics` - Application metrics
- `/status` - Nginx status metrics

### Grafana Dashboards

1. Access Grafana at http://localhost:3000
2. Login with default credentials (admin/admin)
3. Add Prometheus as a data source (URL: http://prometheus:9090)
4. Import or create dashboards to visualize:
   - Request rates
   - Response times
   - Error rates
   - System resources

### Prometheus Configuration

Prometheus is configured to scrape metrics from:
- Nginx Exporter
- Application metrics
- Prometheus itself

## 📖 Documentation

For more detailed documentation about specific features:

- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Your Team
