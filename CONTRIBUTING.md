# Contributing to CRM Pro

First off, thank you for considering contributing to CRM Pro! It's people like you that make CRM Pro such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Set up your environment**: Copy `.env.example` to `.env` and configure
4. **Run the development server**: `npm run dev`
5. **Make your changes** following our coding standards
6. **Test your changes** thoroughly
7. **Commit your changes** with clear, descriptive commit messages
8. **Push to your fork** and submit a pull request

## Development Workflow

### Setting Up Your Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/crm-app.git
cd crm-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your AUTH_SECRET: openssl rand -base64 32

# Set up database
npx prisma generate
npx prisma db push
npm run seed

# Start development server
npm run dev
```

### Project Structure

```
crm-app/
├── app/                 # Next.js app directory (pages & API routes)
├── components/          # React components
├── lib/                 # Utility functions and configurations
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

### Coding Standards

- **TypeScript**: Use TypeScript for all new code
- **Naming Conventions**: 
  - Components: PascalCase (`ContactDetailModal.tsx`)
  - Files: camelCase for utilities, PascalCase for components
  - Variables/Functions: camelCase
- **Formatting**: We use the project's default formatting (will add Prettier in future)
- **Comments**: Write clear comments for complex logic
- **No console logs**: Remove console.logs before submitting PR (console.error is ok)

### Component Guidelines

- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Include proper error handling
- Make components responsive
- Follow existing modal patterns for consistency

### API Route Guidelines

- Use proper HTTP status codes
- Include error handling with try-catch
- Return JSON responses
- Use Prisma for database operations
- Implement selective field updates to avoid relation conflicts

### Database Changes

If you need to modify the database schema:

```bash
# Edit prisma/schema.prisma
# Then create a migration
npx prisma migrate dev --name your_migration_name

# Update seed data if needed in prisma/seed.ts
```

### Testing Your Changes

Before submitting a PR:

1. Test all CRUD operations for affected entities
2. Test on different screen sizes (mobile, tablet, desktop)
3. Verify no console errors in browser
4. Test both authenticated and unauthenticated states
5. Verify drag-and-drop still works (for deal pipeline changes)

## Commit Message Guidelines

Write clear, concise commit messages:

```
Add feature: Brief description

More detailed explanation if needed.
- Bullet points for multiple changes
- Keep lines under 72 characters
```

Examples:
- `Fix: Contact edit not saving phone number`
- `Add: Export to CSV functionality for contacts`
- `Update: Improve mobile responsiveness for dashboard`
- `Refactor: Simplify deal stage update logic`

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md with a note describing your changes
3. The PR will be merged once you have approval from a maintainer
4. Make sure all CI checks pass (when implemented)

## What to Expect After Submitting a PR

- A maintainer will review your PR within a few days
- You may be asked to make changes or clarifications
- Once approved, your PR will be merged
- Your contribution will be acknowledged in the CHANGELOG

## First Time Contributing?

Look for issues labeled `good first issue` or `help wanted`. These are great starting points!

## Questions?

Feel free to open an issue with the `question` label or start a discussion.

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- The CHANGELOG

Thank you for contributing to CRM Pro!
