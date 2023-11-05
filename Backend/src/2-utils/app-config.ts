import dotenv from "dotenv";
dotenv.config();

// Configuration class for application settings

class AppConfig {
    public readonly port = process.env.PORT;
    public readonly host = process.env.HOST;
    public readonly user = process.env.USER;
    public readonly password = process.env.PASSWORD;
    public readonly database = process.env.DATABASE_NAME; 
    public readonly domainName = process.env.ORIGIN + this.port;
}


// Configuration class for development environment
class DevelopmentConfig extends AppConfig {
  public isDevelopment = true;
  public isProduction = false;
}

// Configuration class for production environment
class ProductionConfig extends AppConfig {
  public isDevelopment = false;
  public isProduction = true;
}

// Selecting the configuration based on the NODE_ENV environment variable
const appConfig = process.env.NODE_ENV === "production" ? new ProductionConfig() : new DevelopmentConfig();

// Exporting the selected configuration
export default appConfig;
