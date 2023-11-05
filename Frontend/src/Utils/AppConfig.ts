abstract class AppConfig {
    public readonly registerUrl: string;
    public readonly loginUrl: string;
    public readonly vacationUrl: string;
    public readonly followUrl: string;
    public readonly unfollowUrl: string;
    public readonly vacationFollowed: string;
    public readonly isUserFollowUrl: string;

    public constructor(private baseUrl: string) {
        this.registerUrl = this.baseUrl + "/api/register/";
        this.loginUrl = this.baseUrl + "/api/login/";
        this.vacationUrl = this.baseUrl + "/api/vacations/";
        this.followUrl = this.baseUrl + "/api/vacations/follow/";
        this.unfollowUrl = this.baseUrl + "/api/vacations/unfollow/";
        this.vacationFollowed = this.baseUrl + "/api/vacations/vacationFollowed/";
        this.isUserFollowUrl = this.baseUrl + "/api/vacations/followed-vacations/";
    }
}

class DevelopmentConfig extends AppConfig {
    public constructor() {
        super("http://localhost:4000"); // Development backend address.
    }
}

class ProductionConfig extends AppConfig {
    public constructor() {
        super(""); // Production backend address. You need to provide the actual production URL here.
    }
}

// const appConfig = new DevelopmentConfig();
const appConfig = new DevelopmentConfig();

export default appConfig;
