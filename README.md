# Booking Manager
Booking manager powered by NodeJS. The application stack consists of:

| Client & Server                                            | Server                                                               |
| ---------------------------------------------------------- | -------------------------------------------------------------------- |
| [React](https://facebook.github.io/react/)                 | [ExpressJS](http://expressjs.com/)                                   |
| [React Helmet](https://www.npmjs.com/package/react-helmet) | [Mongoose](http://mongoosejs.com/)                                   |
| [Redux](http://redux.js.org/)                              | [PassportJS](http://passportjs.org/)                                 |
| [Redux Thunk](https://www.npmjs.com/package/redux-thunk)   | [Bcrypt](https://www.npmjs.com/package/bcrypt)                       |
| [Material-UI](http://www.material-ui.com/)                 | [Helmet](https://www.npmjs.com/package/helmet)                       |
| [MomentJS](https://momentjs.com/)                          | [Express Validator](https://www.npmjs.com/package/express-validator) |
| [shortid](https://www.npmjs.com/package/shortid)           | -                                                                    |
| [ChartJS](http://www.chartjs.org/)                         | -                                                                    |

### Table of Contents
* [Installation](#installation)
* [Commands](#commands)
* [Configuration](#configuration)
* [License](#license)

## Installation
1. Clone the repository using `git clone https://github.com/Netflux/booking-manager-COS30043.git`.
2. Install NPM dependencies using `npm install`.
3. Compile the client/server files using `npm run build`.
4. Start the server using `npm start`. The default port is 3000.

\* Tested on Arch Linux (x64). May not work as intended on non-Linux based OS.
\* The login system and booking/room storage require a valid MongoDB connection.

## Commands
| Command             | Description                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| `npm run clean`     | Clean up all compiled/compressed files (dist and static folders)           |
| `npm run lint`      | Run code linting (uses ESLint)                                             |
| `npm run test`      | Run server with live file reloading (client bundle must be built manually) |
| `npm run build-dev` | Compile JSX and build client/server bundle                                 |
| `npm run start-dev` | Run the server in development mode                                         |
| `npm run build`     | Compile JSX and build client/server bundle with production optimizations   |
| `npm run start`     | Run the server in production mode                                          |

## Configuration
Environment variables can be provided when starting the server with `npm run start-dev` / `npm run start`.

| Environment Variable | Default                               | Description                              |
| -------------------- | ------------------------------------- | ---------------------------------------- |
| `PORT`               | `3000`                                | Port used by the server to serve content |
| `DB_URI`             | `mongodb://localhost/booking-manager` | URI pointing to the MongoDB database     |

## License
Copyright (C) 2017

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
