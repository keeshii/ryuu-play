
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
    replayFileSize: 512 * 1024
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
    actionDelay: 250
  },
  sets: {
    scansDir: '',
    scansUrl: '/scans/{set}/{name}.jpg'
  }
};
