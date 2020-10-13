
export const config = {
  backend: {
    address: 'localhost',
    port: 12021,
    serverPassword: '',
    registrationEnabled: true,
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
    rateLimitCount: 10,
    rateLimitTime: 60 * 60 * 1000
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
    debug: false
  },
  bots: {
    defaultPassword: '',
    actionDelay: 250,
    botGamesInterval: 0
  },
  sets: {
    scansDir: '',
    scansUrl: '/scans/{set}/{name}.jpg'
  }
};
