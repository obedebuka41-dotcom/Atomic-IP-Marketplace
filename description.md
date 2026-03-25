# Issue Description: Structured Double-Initialization Guard (#98)

## Problem Summary
The `AtomicSwap::initialize` function previously used a generic `assert!` to prevent double initialization:
```rust
assert!(!env.storage().instance().has(&DataKey::Config), "already initialized");
```
While functional for internal debugging, this approach does not provide a structured error code that client-side applications or other smart contracts can reliably catch and interpret. For production-grade contracts, it is better to use Soroban's `panic_with_error!` macro with a dedicated `ContractError` variant.

## Solution
This change introduces a structured error handling mechanism for the initialization process:
1. **ContractError Extension**: A new variant `AlreadyInitialized = 4` was added to the `ContractError` enum.
2. **Logic Refactor**: The `assert!` was replaced with a conditional check that triggers `panic_with_error!(&env, ContractError::AlreadyInitialized)` if the configuration already exists in the contract's storage.
3. **Automated Verification**: A unit test `test_initialize_twice_panics` was added to ensure that the contract correctly panics with `Error(Contract, #4)` when initialization is attempted more than once.

## Technical Details
- **Affected File**: `contracts/atomic_swap/src/lib.rs`
- **Error Code**: `4` (Contract Error)
- **Tooling used**: Soroban SDK `panic_with_error!` macro.

issue #98
