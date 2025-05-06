
export const config = {
  backend: {
    address: 'localhost',
    port: 12021,
    serverPassword: '', // Password required to create an account
    registrationEnabled: true,  // Completly disables/enables registration
    allowCors: true,
    secret: '!secret!',
    tokenExpire: 86400,
    defaultPageSize: 50,
    avatarsDir: '',
    avatarsUrl: '/avatars/{name}',
    avatarFileSize: 256 * 1024,
    avatarMinSize: 64,
    avatarMaxSize: 512,
    replayFileSize: 512 * 1024,
    rateLimitCount: 10, // Ban IP after that many wrong password errors
    rateLimitTime: 60 * 60 * 1000, // How long the user should be banned
    webUiDir: ''  // Directory to ptcg-play static files (empty = UI disabled)
  },
  storage: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'ptcg'
  },
  core: {
    debug: false,

    // How often should we execute the background tasks
    schedulerInterval: 15 * 60 * 1000, // 15 minutes

    // Wait till next hour before running tasks
    schedulerStartNextHour: true,

    // Decrease players' ranking every day by 0.95
    // If you wish to disable this feature set IntervalCount to 0
    rankingDecraseRate: 0.95,
    rankingDecraseTime: 24 * 60 * 60 * 1000,
    rankingDecreaseIntervalCount: 4,  // run every X scheduler ticks

    // Deletes matches older than `keepMatchTike` from the database, to keep it small.
    // If you wish to disable this feature set IntervalCount to 0
    keepMatchTime: 31 * 24 * 60 * 60 * 1000,
    keepMatchIntervalCount: 4,  // run every X scheduler ticks

    // Deletes users that doesn't log in in the `keepUserTime` and their ranking is 0
    // If you wish to disable this feature set IntervalCount to 0
    keepUserTime: 7 * 24 * 60 * 60 * 1000,
    keepUserIntervalCount: 4  // run every X scheduler ticks
  },
  bots: {
    // Default password for bot user
    defaultPassword: '',

    // Delay between every action that bot is making
    actionDelay: 250,

    // Simulate matches every X ticks of the scheduler
    // If set to 0, the bot matches are disabled
    botGamesIntervalCount: 0
  },
  sets: {
    scansDir: '',
    scansDownloadUrl: 'http://localhost/scans', // Server downloads missing scans from there
    scansUrl: '/scans/{set}/{name}.jpg'
  },
  email: {
    transporter: {
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    },
    sender: 'example@example.com',
    appName: 'RyuuPlay',
    publicAddress: 'http://localhost' // Address inside the e-mail messages
  }
};
