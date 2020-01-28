FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["ContrAllStudioManagementBackend/ContrAllStudioManagementBackend.csproj", "ContrAllStudioManagementBackend/"]
COPY ["CoreDatabase/CoreDatabase.csproj", "CoreDatabase/"]
COPY ["CoreModels/CoreModels.csproj", "CoreModels/"]
RUN dotnet restore "ContrAllStudioManagementBackend/ContrAllStudioManagementBackend.csproj"
COPY . .
WORKDIR "/src/ContrAllStudioManagementBackend"
RUN dotnet build "ContrAllStudioManagementBackend.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "ContrAllStudioManagementBackend.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "ContrAllStudioManagementBackend.dll"]