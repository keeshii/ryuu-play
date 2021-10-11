# RyuuPlay

RyuuPlay is a simulator for the Pokémon Trading Card Game written in TypeScript. The source code is entirely open source and published under MIT licence.

The project is created for the educational purpose only. There are no plans to adding new features or cards, but feel free to fork it and experiment on your own.

### Demo

An example server instance with some AI bots included. To create an account you need to provide the password `letsplaypokemontcg`.

Web page:
https://ptcg.ryuu.eu/

Android application:
[RyuuPlay-latest.apk](https://ptcg.ryuu.eu/RyuuPlay-latest.apk)

Screenshots:
[00.png](https://github.com/keeshii/ryuu-play/raw/master/fastlane/metadata/android/en-US/images/phoneScreenshots/00.png)
[01.png](https://github.com/keeshii/ryuu-play/raw/master/fastlane/metadata/android/en-US/images/phoneScreenshots/01.png)

### Project overview

The project consists of three packages:

* **ptcg-server** is a game server. It is responsible for calculating the game state and propagating it to the connected clients by websockets.

* **ptcg-play** is a web application written in Angular. It displays the game state and allows interaction with the server.

* **ptcg-cordova** is a cordova wrapper for the ptcg-play package, so it can be running as an android application. This has some advantages like storing card images in the cache or avoiding CORS issues.

### Server launch

Server is a simple node.js application written in TypeScript. It uses express with websockets and [typeorm](https://typeorm.io/#/) for database access.

Prerequisites:
* Node.js 8 LTS or higher
* mysql-5 or sqlite-3

After clonning the repository, go to the directory `ptcg-server` and edit the `config.js` file. All available options and its default values are defined in the `src/config.ts`.

1. Firstly install all required dependencies.

```
npm install
```

2. Then, build the project and start it.

```
npm run build
npm start
```

The service should now listen on the specified address and port. It will be http://localhost:12021, when no changes has been made to the config files.

### Storage

By default the server is using the sqlite-3 database. If you want to run it with mysql, some changes in the `config.js` are required. An example configuration is presented below. You may check [typeorm](https://typeorm.io/#/) web site to investigate more connection capabilities.

```
config.storage.type = 'mysql';
config.storage.host = 'localhost';
config.storage.port = 3306;
config.storage.username = 'root';
config.storage.password = '';
config.storage.database = 'name';
```

### Client launch

The client is an Angular application. For more detailed setup information, you may visit the page https://angular.io/. The source code of the client is located in the `ptcg-play` directory.

1. The server package is a dependency required by the client. First you must build the server, it was described in the previous section.

2. With server compiled, you can go now to the `ptcg-play` directory and install dependencies.

```
npm install
```

3. Start the aplication.

```
npm start
```

The command above will start the application in the debug mode at http://localhost:4200.

### Building android application (cordova)

Building an android wrapper is a little more complicated than the web client. The android-sdk or android studio must be installed on the computer first.

1. Edit the file `ptcg-play/src/environments/environments.prod.ts` and set following variables to `true`:

```
  allowServerChange: true,
  enableImageCache: true,
```

* **allowServerChange** displays an additional option on the login window, that allows user to change the server url.
* **enableImageCache** enables cache, so the card images are stored in the phone memory and not downloaded from server every time.


2. Go to the `ptcg-cordova` directory and install dependencies.

```
npm install
```

3. Create android project with cordova.

```
npx cordova platform add android
```

4. Build the web client. It will also apply some patches to the cordova sources to correct the scale for the phones/tablets.

```
npm run build
```

5. Use cordova to build the android application.

```
npx cordova build android --release
```

You may find more detailed instruction on the https://cordova.apache.org/


### Managing cards

The cards are implemented on the server side. It is not required to rebuild the client after adding/modyfing the cards, because all the simulation is handled by the server and list of available cards are downloaded by clients after successful login. This guarantees consistency between clients.

Currently there are about 250 cards added to the project. You may find them in the the directory `ptcg-server/sets`. If you wish to add some more cards, it is the good place to look into.

The best way to enable/disable a set is by editing the file `ptcg-server/start.js` and commenting calls to the `defineSet` function:
```
cardManager.defineSet(setDiamondAndPearl);
cardManager.defineSet(setHgss);
cardManager.defineSet(setBlackAndWhite);
```

### Adding bots

You can create autonomous AI players on your private server. They work as regular player that always has time to play with you. Initially there is one bot loaded, called `bot`, of course you can always add more. They are defined in the file `ptcg-server/start.js`.

```
botManager.registerBot(new SimpleBot('bot'));
```

SimpleBot is the universal AI implementation that should be capable of playing with any deck. It creates list of possible actions, simulates the outcome and compares the score of the game state. Then chooses the best possible action and repeats the process until its turn is over. For more details check the source code at `ptcg-server/src/simple-bot`.

Server is automatically creating an account for bot user with password provided in the `config.js` file. You can login as that user, define its deck and set an avatar. AI player won't be able to accept the game invitation until you provide him a valid deck. If you define more than one deck, then each time bot will randomly choose one.

### License

MIT
