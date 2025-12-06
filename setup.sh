#!/bin/bash

echo "🚀 Setting up CRM Pro..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp .env.example .env
else
  echo "✓ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "📊 Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database with example data..."
npm run seed

echo "✅ Setup complete!"
echo ""
echo "Start the development server with:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
