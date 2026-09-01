# Contributing to ProofRoute

Thank you for contributing to ProofRoute! Please follow these guidelines to keep our codebase clean, robust, and well-tested.

## 🌿 Branching Strategy
- `main`: Production-ready code.
- `develop`: Integration branch for tested features.
- `feat/<feature-name>`: New feature implementations.
- `fix/<bug-name>`: Bug fixes.
- `chore/<task>`: Maintenance, tooling, and documentation.

## 📝 Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(contracts): add document hash registry contract`
- `fix(indexer): resolve block reorg sync gap`
- `test(ml): add verification pipeline unit tests`
- `docs(api): update API contract for document upload endpoint`

## 🧪 Quality Gates
Before creating a pull request:
1. Ensure all linting checks pass.
2. Run unit and integration tests.
3. Verify smart contracts compile and pass invariant/fuzz tests.
4. Update relevant documentation in `docs/`.
