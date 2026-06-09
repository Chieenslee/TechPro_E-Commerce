FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
# Copy csproj and restore
COPY backend.csproj ./
RUN dotnet restore
# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
# Railway provides the PORT environment variable dynamically
# ASP.NET Core 8+ automatically listens to HTTP_PORTS or ASPNETCORE_HTTP_PORTS
# We can also explicitly tell it to listen to any port Railway gives via shell
CMD dotnet backend.dll --urls "http://0.0.0.0:${PORT:-8080}"
