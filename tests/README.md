# 🧪 ProofRoute Test Suites

Cross-domain integration tests, end-to-end user journey tests, and security quality gates for ProofRoute.

---

## 📐 Testing Pyramid

```
       /\
      /E2E\         <- Playwright (Full User Journeys)
     /------\
    /  Integ \       <- API + DB + Blockchain Mock Integration
   /----------\
  /    Unit    \     <- Pytest, Forge Fuzzing, Vitest
 /--------------\
```

---

## 🚀 Running Tests

### 1. Run Complete Test Suite
```bash
# Smart Contracts (Foundry)
cd contracts && forge test

# Backend & ML Unit Tests (Pytest)
cd ../backend && pytest

# Frontend Unit Tests (Vitest)
cd ../frontend && npm test

# End-to-End User Journey Tests (Playwright)
cd ../tests && npx playwright test
```
