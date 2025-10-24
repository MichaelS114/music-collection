<p align="center">
<img src="./logo-music.svg" style="height: 60px;"/>
</p>
<p align="center">
KV Service Engineering - Gruppe A
</p>


## Project setup
1. Installieren in Ordnern ./client und ./backend

```
$ npm install
```


**Die folgenden Punkte beziehen sich nur auf das Backend und werden in ./backend ausgeführt:**


 2. ".env" Datei im Projektverzeichnis von ./backend anlegen
 
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

!! Bei Verwendung von Admin-Endpunkten folgendes im Header mitsenden:

```
key: x-admin
value: true
```

## Database schema

<img src="./uml.svg" style="height: 500px;" />


## How to

### Start the Project:

Frontend starten
```
npm run dev
```


Backend starten
```
npm run start:dev
```

### Update database schema

Edit the schema file and run the following code:

```
npx prisma migrate dev --NameDerÄnderung init
```

### Compile and run the backend project

```
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Run backend tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
