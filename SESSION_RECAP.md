# ZZDC QuickBooks Session Recap

## Completed Work

### Phase 1-4: Account Structure Created
- **17 Phase 1 accounts**: Income (4100-4400), NetJets expenses (7100-7500), NetJets assets (1500-1650), Member liabilities & equity
- **10 Phase 2 sub-accounts**: Travel (6110-6140), Professional Services (6310-6330), Meals (6210-6220)
- **4 Phase 3 household accounts**: 5100-5400
- **Vendors**: NetJets Inc created
- **Customers**: 5 placeholder customers (Client-001 through Client-005)

### Phase 5: Reconciliation Analysis
- **Jeff Personal Account (138)**: -$20,995.60 — 9 recurring vehicle payments (leases + loan interest), no discrepancy
- **Centurion Card (137)**: -$35,765.59 — Opening balance only, no transactions imported yet
- **ZZ Dream Consulting LLC (140)**: $0.00 — No activity yet
- **Uncategorized accounts**: All at $0.00, no uncategorized transactions

### Current Existing Transactions (from Jeff Personal Account)
| Date | Amount | Current Category |
|------|--------|------------------|
| 2025-12-15 | $2,743.92 | Vehicle loan interest |
| 2025-12-10 | $1,318.01 | Vehicle loan interest |
| 2025-11-25 | $2,599.90 | Vehicle leases |
| 2025-11-14 | $2,743.92 | Vehicle loan interest |
| 2025-11-10 | $1,318.01 | Vehicle loan interest |
| 2025-10-30 | $2,599.90 | Vehicle leases |
| 2025-09-25 | $2,599.90 | Vehicle leases |
| 2025-09-15 | $2,743.92 | Vehicle loan interest |
| 2025-09-08 | $2,701.92 | Vehicle loan interest |

---

## Session 2: ZZ Domestic Expense Organization (Completed)

### Personal Expense Chart of Accounts (8000-8999)
Created 63 accounts total:
- **8000 Vehicle Expenses**: 8 sub-accounts (8010-8075)
- **8100 Housing & Property**: 4 sub-accounts (8110-8140)
- **8200 Utilities**: 6 sub-accounts (8210-8260)
- **8300 Insurance**: 4 sub-accounts (8310-8340)
- **8400 Personal Services**: 5 sub-accounts (8410-8450)
- **8500 Health & Wellness**: 6 sub-accounts (8510-8560)
- **8600 Food & Dining**: 4 sub-accounts (8610-8640)
- **8700 Entertainment & Lifestyle**: 7 sub-accounts (8710-8740, 8721-8723)
- **8800 Family & Gifts**: 3 sub-accounts (8810-8830)
- **8900 Other Personal**: 6 sub-accounts (8910-8990, 8925)

### Jeff Personal Account - Re-categorized
All 9 vehicle payments updated with proper accounts and vendors:
- GM Financial → 8010 Vehicle - GM Financial Loan
- Audi Financial → 8020 Vehicle - Audi Financial Loan
- CAF → 8030 Vehicle - CAF Lease

### Vendors Created
- GM Financial
- Audi Financial Services
- Capital Auto Finance (CAF)

### Centurion Card Setup
- Reconnected bank feed to ZZ Domestic
- Analyzed 50 transactions from CSV export
- Created Amazon strategy: All Amazon → 8925 Amazon Purchases
- Documented 17 bank rules for auto-categorization

### Files Created
- `CENTURION_CATEGORIZATION_GUIDE.md` — Full bank rules and category reference

### Remaining Tasks
- [ ] Create bank rules in QuickBooks UI (Settings → Rules) — See `CENTURION_CATEGORIZATION_GUIDE.md`
- [ ] Accept/categorize Centurion Card transactions in Banking tab
- [ ] Cancel duplicate QBO subscription — **Call Intuit to cancel** (old Centurion-only account disconnected since 2022)

---

## Next Session: Priorities

1. **Centurion Card cleanup** — Once bank rules are created and transactions categorized
2. **Review Amazon purchases** — Quarterly review to split 8925 into specific categories if needed
3. **Expand to other accounts** — Apply same categorization approach to other bank feeds

---

## Technical Reference

### QuickBooks Connection
- **Company**: Zalaznick Domestic
- **Company ID**: 9341453748656108
- **Environment**: Production
- **MCP Server**: `/Users/samfoley/quickbooks-mcp-server`

### Useful Queries
```python
# Get all accounts
qb.query("SELECT * FROM Account")

# Get all purchases
qb.query("SELECT * FROM Purchase ORDER BY TxnDate DESC MAXRESULTS 100")

# Get specific account type
qb.query("SELECT * FROM Account WHERE AccountType = 'Expense'")

# Get vendors
qb.query("SELECT * FROM Vendor")
```

### API Limitations
- Cannot query by AccountRef, DepositToAccountRef (not queryable fields)
- Cannot use OR in WHERE clause (use IN instead)
- Cannot ORDER BY AccountType
- Bank rules not accessible via API (UI only)
