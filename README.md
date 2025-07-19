# CivicEye - Detect. Report. Reclaim Your City.

A modern civic-tech platform that empowers communities to identify, report, and track vacant urban properties using AI-powered tools and blockchain technology.

![CivicEye Dashboard](https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&w=1200&h=400&fit=crop)

## 🌟 Features

### Core Functionality
- **AI-Powered Detection**: Advanced algorithms analyze property data to identify potential vacant properties
- **Community Reporting**: Easy-to-use form for citizens to report suspected vacant properties with photos and details
- **Interactive Map**: Real-time visualization of reported properties with color-coded status markers
- **Smart Contract Enforcement**: Blockchain-powered automated tax penalty system
- **Reward System**: Point-based leaderboard with badges and achievements for active contributors
- **PDF Generation**: Downloadable tax notices and penalty documents

### Technical Features
- **Real-time Updates**: WebSocket integration for live status updates across all users
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile
- **Dark/Light Mode**: Smooth theme toggle with preference persistence
- **Advanced Filtering**: Search and filter properties by status, location, and other criteria
- **Performance Optimized**: Fast loading with skeleton states and optimized queries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/civiceye.git
   cd civiceye
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install --save-dev cross-env
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to see the application running.



5. **Project Structure**

├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and configuration
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript type definitions
├── server/               # Express backend
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # Data persistence layer
└── shared/               # Shared code between frontend and backend
    └── schema.ts         # Database schema and types


6. **Contributing**
Contributions are welcome! Please feel free to submit a Pull Request