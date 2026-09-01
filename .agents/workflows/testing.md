# Testing & Quality Gate Workflow

1. Run linters and type checkers.
2. Run smart contract unit and invariant tests (`forge test`).
3. Run backend & ML test suite (`pytest`).
4. Run frontend test suite (`npm test`).
5. Ensure zero failing tests before merging or deploying.
