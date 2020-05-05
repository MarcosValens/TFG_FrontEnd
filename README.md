# Port Scanner (frontend)

This is the frontend part of the TFG project by Benjamin Cardona and Marcos Valens. This part works with the data received when making requests to a backend server (which is also part of this project).
The purpose of this project is to create a web application that is capable of doing a port scan and saving the records in a database (which is also part of the project) and being able to modify the records depending on how the client connects.
There are two different options:
The first is to connect through a browser, this option only allows you to view and modify the data already inserted in the database.
The second is through an electronic client, which apart from having the same capabilities as the previous option, is also capable of doing port scans.

This part of the project is based on NodeJs and we use the 'Quasar' framework to do all the work. We also use Docker images to make the project exportable.

## Install the dependencies

To install the dependencies, just follow the Docker documentation.

+ Docker for Mac:
https://docs.docker.com/docker-for-mac/install/
+ Docker for Windows:
https://docs.docker.com/docker-for-windows/install/
+ Docker for ubuntu:
https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/



### Start the app
First you will download the docker image from docker hub, for do this type the next line
```
docker pull tfgportscanner/portscanner-frontend:latest
```
You must have to type this in the context folder:
```
docker run -dit --name frontend -p 8081:80 -v $(pwd)/dist/spa/:/usr/local/apache2/htdocs/ httpd:2.4
```
if you are using linux you must use the command sudo.

### Customize the configuration

This is an example of what parameters you must use in the configuration file called .env.

>This makes reference to the root backend url.
* BACKEND_URL=http://localhost:8000

>This is the base route for the scanner endpoint in the scanner server, you must not change this variable, because scanner server will be launched in local mode on the electron client and it will be installed in a npm package.
* SCANNER_URL=http://localhost:8001
