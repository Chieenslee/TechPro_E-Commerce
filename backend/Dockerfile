FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Context build của Railway là thư mục gốc, nên ta copy theo đường dẫn backend/
COPY backend/backend.csproj backend/
RUN dotnet restore backend/backend.csproj

# Copy toàn bộ code backend
COPY backend/ backend/
WORKDIR /src/backend
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
# Khởi động Backend
CMD dotnet backend.dll --urls "http://0.0.0.0:${PORT:-8080}"
