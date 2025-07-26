#!/bin/bash

# Build script for KS Knowledge Sharing Platform
set -e

echo "🏗️  Building KS Knowledge Sharing Platform..."

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📍 Using Node.js $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linting..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm run test:coverage

# Build documentation
echo "📚 Building documentation..."
npm run docs:build

echo "✅ Build completed successfully!"
echo "🎉 Ready for deployment!"