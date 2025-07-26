#!/bin/bash

# Development setup script for KS Knowledge Sharing Platform
set -e

echo "🚀 Setting up KS Knowledge Sharing Platform for development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be >= 18.0.0. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

# Install Git hooks
echo "🎣 Setting up Git hooks..."
npm run prepare

# Run initial tests
echo "🧪 Running initial tests..."
npm test

echo ""
echo "🎉 Development setup completed successfully!"
echo ""
echo "🚀 Quick start commands:"
echo "  npm run dev      - Start development server"
echo "  npm test         - Run tests"
echo "  npm run lint     - Run linting"
echo "  npm run format   - Format code"
echo ""
echo "📚 Documentation:"
echo "  README.md           - Project overview"
echo "  CONTRIBUTING.md     - Contribution guidelines"
echo "  docs/               - Additional documentation"
echo ""
echo "Happy coding! 💻"