<img src="./logo-music.png" style="height: 40px;" />

KV Service Engineering

Gruppe A

## Project setup
1. Installieren

```
$ npm install
```
 2. ".env" Datei im Projektverzeichnis erstellen
 
Inhalt:
```
DATABASE_URL="file:./dev.db"
```

3. DB mit Testdaten befüllen
```
$ npx prisma db seed
```

!! Bei Verwendung von Admin-Endpunkten folgendes im Header mitsenden:

key: x-admin

value: true

## Compile and run the project

```
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
