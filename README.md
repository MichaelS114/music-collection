<img src="./logo-music.png" style="height: 40px;" />

KV Service Engineering

Gruppe A

## Project setup
1. Installieren

```
$ npm install
```
 2. ".env" Datei im Projektverzeichnis anlegen
 
Inhalt:
```
DATABASE_URL="file:./dev.db"
```
3. Prisma Client generieren und Migrationen ausführen

```
npx prisma generate
npx prisma migrate dev
```

4. DB mit Testdaten befüllen
```
$ npx prisma db seed
```

5. Projekt starten
```
npm run start:dev
```

!! Bei Verwendung von Admin-Endpunkten folgendes im Header mitsenden:

```
key: x-admin
value: true
```

## Database schema

<img src="./uml.svg" style="height: 500px;" />


## How to

### Update database schema

Edit the schema file and run the following code:

```
npx prisma migrate dev --NameDerÄnderung init
```

### Compile and run the project

```
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
