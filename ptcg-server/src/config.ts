
export const config = {
  backend: {
    address: 'localhost',
    port: 12021,
    serverPassword: '',
    registrationEnabled: true,
    secret: '!secret!',
    tokenExpire: 86400
  },
  storage: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'ptcg'
  }
};
