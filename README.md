# Black Street

***Note: The development of this application has been stopped, due to security issues related to FXP. As direct transfer between remote servers was the purpose of this application, alternative solutions using double FTPS connection and transfer through the client will not be explored. You can still use the simple FTPS connection provided by the current application to list files on remote servers.***

Black Street is a web application that allows you to connect to FTPS servers and list your files remotely.

## Getting Started

### System requirements

* NodeJS
* npm
* MongoDB

### Setup instructions
* Install dependencies: `npm install`
* Transcompile frontend TS: `npm run build`
* Run: `npm run start`

The server is now running at `http://localhost:3000`

#### Database
As the only users that have the ability to create accounts on the server are the administrators, you won't be able to login at first. Ensure mongodb is running on your system and you have the `mongorestore` utility, then use `npm run setup_db` to create a first user with the following attributes:
* Account name: **admin**
* Password: **admin**
* Role: **admin**

**WARNING**: It is **strongly recommended** to change the account name and the password of this account right after the first login, especially if you plan to expose the server to any network. This administration panel allows you to change this credentials.

### One-liner
To perform all the operations at once (install dependencies, build frontend, setup DB and launch server), you can use `npm run fast`

### Additional recommendations

It is recommended to create a file `local.json` in the folder `backend/config/` to overwrite the default parameters available in `default.json`. Especially, it would be a security issue to keep the default `'General.session_secret'`.

## Current features

Features are limited to the following:
* *FTPS servers*
    * A user can create FTPS server entry, meaning supply the connection information (host, port, user, password), and then connect to the given server. Once connected, the user can navigate through the folders to list the files. Files transfer is not available.
    * Only secure connections are allowed. This means an FTPS server entry needs to have a `certificate_path` attribute which is the absolute path *on the system running your nodeJS server* to a valid X509 certificate for the FTPS server your are trying to connect to. Certificate direct upload is not available.
    * Any administrator has the ability to create, update, or delete any FTPS server entry.
* *Accounts*
    * Any administrator has the ability to create, update, delete, or change permissions of the accounts. 

## Running the tests
Some backend and frontend tests can be performed using `npm run test`. 

## Authors
* **Anaël Moissiard** - *Initial work* - [waaker](https://github.com/waaker)

## License
This project is licensed under the GNU General Public License v3 - see the [LICENSE](LICENSE) file for details

