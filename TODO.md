# Fix #99: Structured Pause Error

## Completed
- [x] Checkout new branch `blackboxai/fix-99-panic-structured-error`

## Remaining
- [ ] Edit `contracts/atomic_swap/src/lib.rs`
  - Add `ContractPaused = 4` to ContractError
  - Replace assert! with panic_with_error!
  - Update 2 test expected panics
- [ ] git add .
- [ ] git commit
- [ ] gh pr create

