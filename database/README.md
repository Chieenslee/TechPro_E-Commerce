# TechPro Database

This folder is the SQL baseline for moving the current JSON-backed API to a relational database.

## Files

- `schema.sql`: SQL Server / Azure SQL schema with constraints, indexes, and foreign keys.
- `seed.sql`: starter admin/customer/product/review/address data.
- `import-json-data.ps1`: imports the current JSON data from `backend/Data` into SQL while preserving app IDs.

## Apply Locally

```powershell
sqlcmd -S localhost -d TechPro -i database\schema.sql
sqlcmd -S localhost -d TechPro -i database\seed.sql
```

## Import Current App Data

Use this after `schema.sql` when you want SQL to mirror the current JSON-backed local data:

```powershell
.\database\import-json-data.ps1 `
  -ConnectionString "Server=localhost;Database=TechPro;Trusted_Connection=True;TrustServerCertificate=True" `
  -DataDirectory "D:\My\CNPM\TechPro_E-Commerce\backend\Data"
```

The import clears app tables first, then loads users, products, product tags, orders, order items, reviews, and newsletter subscribers from JSON. Restart the backend after importing so `/api/system/storage` reports `sql`.

## Migration Notes

The backend now uses SQL automatically when `ConnectionStrings:TechProDb` points to an available database with the schema applied. If SQL is unavailable, it falls back to JSON persistence in `backend/Data`.
