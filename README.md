# JUMBOCASH-T9

Team ID: JUMBOCASH-T9 | Team Members: Ayush Shah &amp; Akshat Mangal

> Jumbotail is an online marketplace for food and grocery, targeted at kirana stores/wholesale distributors/vendors. These businesses buy from the Jumbotail marketplace for their retail sales.
> This application aims at easing their life by allowing them to track their overall cash flow in one place, along with viewing and organizing historical data to look for patterns that can help them improve their business processes. Since most of these small businesses work on micro-credit, monitoring their overall cash flow regularly in one place is a boon.

## Features

1. Add entity (vendor, customer).
2. Add individual transactions for each entity (vendor, customer).
3. Set email reminders for pending transactions.
4. View historical transactions.
5. Export the transaction details to CSV.
6. Filter transactions based on its type, status, mode, entity type and between two dates.
7. Sort transactions according to different fields in ascending or descending order.
8. Search transactions of a particular entity using entity name.
9. View overall cashflow summary and cashflow summary for a particular period (for example: cashflow summary for 1st April 2021 - 30th April 2021).
10. View list of entities added.
11. Sort and search entities by names.
12. Pagination on the frontend - only a fixed, limited number of transactions per page. The remaining ones go to a navigable new page.
13. See reports of various transactional parameters for current year, current month and current week.
14. Provide relevant insights based on the frequency of transactional parameters - Favourite vendor and customer, the total balance in and out, etc.
15. Able to edit existing transactions and entities.
16. Login/Sign Up using google and facebook OAuth.

## Installation and Usage

## Local -

Make sure you have Nodejs and react scripts installed globally in your system.
And if you want to use a local database then install mongodb as well in your system.

### Backend

```sh
$ cd JUMBOCASH-T9/backend
$ cp .env.template .env.development
# Now fill all the env variables inside .env.development file.
$ npm install
$ npm run dev
```

### Frontend

```sh
$ cd JUMBOCASH-T9/client
$ npm install
# Start React DevServer: http://localhost:3000
$ npm start
```

Now you can access the site locally at http://localhost:3000

## Production -

Make sure you have Nodejs installed globally in your server.

### Backend

```sh
$ cd JUMBOCASH-T9/backend
$ cp .env.template .env.production
# Now fill all the env variables inside .env.production file.
$ npm install
$ npm start
```

### Frontend

```sh
$ cd JUMBOCASH-T9/client
$ npm build
```

Now you can deploy the production build created.

## Testing

This will run all the tests for the backend.
**Note** - Don't use the development database for testing purposes. Instead use a test database and add its url in .env.test file.

```sh
$ cd JUMBOCASH-T9/backend
$ cp .env.template .env.test
# Now fill all the env variables inside .env.test file.
$ npm test
```

## Docker :whale:

**Note** - You need [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system.

```sh
$ cd JUMBOCASH-T9
$ docker-compose up --build
```

This will build the images and start the docker containers for the backend, frontend and the mongodb database.
Now you can access your application at http://localhost/

## Authors

**[Ayush Shah](https://github.com/shahayush457)**
**[Akshat Mangal](https://github.com/iamakshat01)**
