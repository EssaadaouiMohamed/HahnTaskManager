# Stage 1: Build Angular app
FROM node:18-alpine AS angular-build
WORKDIR /app
COPY ["hahntaskmanager.client/package.json", "hahntaskmanager.client/package-lock.json*", "./"]
RUN npm install
COPY hahntaskmanager.client .
RUN npm run build -- --configuration=production --output-path=dist/taskmanager

# Stage 2: Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS dotnet-build
WORKDIR /src
COPY ["HahnTaskManager.Api/HahnTaskManager.Api.csproj", "HahnTaskManager.Api/"]
RUN dotnet restore "HahnTaskManager.Api/HahnTaskManager.Api.csproj"
COPY . .
RUN dotnet publish "HahnTaskManager.Api/HahnTaskManager.Api.csproj" -c Release -o /app/publish

# Stage 3: Final image
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview
WORKDIR /app
COPY --from=angular-build /app/dist/taskmanager ./wwwroot
COPY --from=dotnet-build /app/publish .
ENTRYPOINT ["dotnet", "HahnTaskManager.Api.dll"]