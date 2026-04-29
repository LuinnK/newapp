# Contributing Guide

## Getting Started

1. Fork and clone the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Follow the setup guide in `docs/SETUP.md`

## Code Style

- Use ES6+ syntax
- Use TypeScript for React components
- 2-space indentation
- ESLint configuration enforced

## Commit Messages

- Use clear, descriptive messages
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`
- Example: `feat(audio): add vocal extraction`

## Pull Request Process

1. Ensure tests pass: `npm test`
2. Update README/docs if needed
3. Request review from maintainers
4. Ensure CI/CD passes

## Issues & Discussions

- Use GitHub Issues for bugs
- Use Discussions for ideas
- Include as much detail as possible

## Development Workflow

1. **Backend Changes**: Update `backend/` files, test with `npm run dev:backend`
2. **Frontend Changes**: Update `frontend/` files, test with `npm run dev:frontend`
3. **Documentation**: Update `docs/` for significant changes

## Performance Tips

- Use React.memo for expensive components
- Lazy load components when possible
- Optimize audio processing with Worker threads
- Cache API responses appropriately

Thank you for contributing! 🎵
