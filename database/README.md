# TechPro Database

This folder is the SQL baseline for moving the current JSON-backed API to a relational database.

## Files

- `schema.sql`: SQL Server / Azure SQL schema with constraints, indexes, and foreign keys.
- `seed.sql`: starter admin/customer/product/review/address data.

## Apply Locally

```powershell
sqlcmd -S localhost -d TechPro -i database\schema.sql
sqlcmd -S localhost -d TechPro -i database\seed.sql
```

## Migration Notes

Current backend runtime still uses JSON persistence in `backend/Data` while the SQL layer is introduced. The next step is to replace the in-memory lists in `backend/Program.cs` with repository methods backed by these tables.
