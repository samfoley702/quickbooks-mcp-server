# QuickBooks MCP Server

## Project Overview

MCP (Model Context Protocol) server that exposes QuickBooks Online API as tools for Claude. Python-based, runs via stdio transport using FastMCP.

## Architecture

```
main_quickbooks_mcp.py    # MCP tool definitions (entry point)
quickbooks_interaction.py # QuickBooksSession - OAuth2 client, API calls
api_importer.py           # Parses quickbooks_openapi_schema.json to dynamically register read-only API tools
environment.py            # Thin wrapper around os.getenv with dotenv
quickbooks_entity_schemas.json  # Entity field schemas for query building
quickbooks_openapi_schema.json  # Full OpenAPI spec for dynamic tool generation
```

## Running

```bash
uv run main_quickbooks_mcp.py
```

Requires `.env` with: `QUICKBOOKS_CLIENT_ID`, `QUICKBOOKS_CLIENT_SECRET`, `QUICKBOOKS_REFRESH_TOKEN`, `QUICKBOOKS_COMPANY_ID`, `QUICKBOOKS_ENV` (sandbox|production).

## MCP Tools

**Core tools** (defined explicitly in `main_quickbooks_mcp.py`):
- `query_quickbooks` - SQL-like queries (`select * from Account where Active = true`)
- `get_quickbooks_entity_schema` - Look up entity fields before querying
- `update_entity` - Sparse updates (deactivate accounts, modify vendors, etc.)
- `create_entity` - Create new entities (invoices, journal entries, vendors, etc.)
- `delete_entity` - Delete transactions (purchases, invoices, bills, journal entries)
- `batch_operation` - Bulk operations, max 30 per batch

**Dynamic tools** (auto-generated from OpenAPI schema at startup):
- `get_account_accountId`, `get_bill_billId`, `get_vendor_vendorId`, etc.
- `get_reports_ProfitAndLoss`, `get_preferences`, and other read endpoints

## QuickBooks API Quirks

These are critical patterns learned from production use:

- **Account updates require `Name`**: Even with `sparse: true`, the QBO API requires the `Name` field when updating accounts. Always include it.
- **Deactivate sub-accounts first**: Parent accounts cannot be deactivated while they have active sub-accounts. Deactivate children before parents.
- **Non-zero balance blocks deactivation**: Accounts with a balance cannot be deactivated. Create a journal entry to zero the balance first (e.g., debit Owner Draws, credit the account).
- **Accounts/Vendors/Customers cannot be deleted**: Use `update_entity` with `Active: false` to deactivate instead.
- **Bank-matched transactions can't be deleted via API**: Purchases matched to bank feed downloads will fail with error 6480. They must be unmatched in the QBO web UI first.
- **SyncToken is mandatory and must be current**: Always query the entity first to get the latest SyncToken before any update or delete.
- **Batch max is 30 operations**: Split larger operations into multiple batch calls.
- **`entity_data` accepts `Union[str, dict]`**: The write tools handle both JSON strings and dict objects for compatibility with different MCP clients.

## Development Notes

- Python 3.12+, managed with `uv`
- Dependencies: `mcp[cli]`, `requests`, `python-dotenv`
- OAuth2 refresh token flow with automatic retry on 401
- The server auto-refreshes the access token on expiry; the refresh token itself is long-lived but rotates on each use
- Never commit `.env` files (contains OAuth credentials)
