
export const config = {
  backend: {
    address: 'localhost',
    port: 12021,
    serverPassword: '',
    registrationEnabled: true,
    secret: '!secret!',
    tokenExpire: 86400,
    defaultPageSize: 50,
    avatarsDir: '',
    avatarFileSize: 50 * 1024,
    avatarMinSize: 50,
    avatarMaxSize: 200
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
  sets: {
    scansDir: '',
    scansUrl: '/scans/{set}/{name}.jpg'
  }
};
