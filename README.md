# service-registry
a node-based service registry for managing microservices over HTTP

## usage
there are **2 ways** to run this service registry: 
* as a docker container (the cool way 😎)
* as a node process directly on the destination machine (the obvious way)

### using docker
the **recommended** way is to spin up a docker container of this service registry. <br />
it will allow you to easily run this service as a background process and easily choose whatever port you'd like. <br />
```cd``` to the ```service-registry``` directory and do the following
* **step 1** - build the image <br />
```bash
sudo docker build -t service-registry .
```
* **step 2** - run the container as a background process <br />
```bash
sudo docker run -d -p [your host port]:3000 --name [name the container]
```
conveniently, you can run <br />
```bash
sudo docker logs [the name of your container]
```
to checkout the logs without attaching or executing a new process. 

### using node.js
to run this service registry as a regular node process: <br />
```cd``` to the ```service-registry``` directory and do the following
```bash
npm install \
npm start
```
you can use a process manager like [pm2](https://pm2.keymetrics.io/) to run it in the background <br />
the service registry will run on ```http://localhost:3000```

## API 

* to register a service: <br />
```
PUT /<service-name>/<version>/<port> 
```
* to find a running service: <br />
```
GET /<service-name>/<version>
```
>this registry uses *semver*, so you can request *incomplete* versions <br /> 
and it will automatically respond with a suitable service. (also act as a layer of load balancing)
* to remove a running service: <br />
```
DELETE /<service-name>/<version>/<port>
```
### expiration
a service that hasn't made communication with the registry for **over 30 seconds** <br />
will be considered as **expired** (meaning that it will be unavailable for consumers). 

you can send a *heartbeat* to the service registry to keep the service *alive*. <br />
**sending a heartbeat** is simply registering a registered service. <br />
for example if the service: 
```json
{
  "name": "mailing-service",
  "version": "1.0.3",
  "ip": "127.0.0.1",
  "port": 5555,
}
```
is an already registered **running** service. <br />
by calling ```PUT /mailing-service/1.0.3/5555```, the service will send a heartbeat to the registry.

> make sure this heartbeat is faster than 30 seconds (something like 15~20 seconds is good)

## example

let's say I have a *mailing service* and I want to start it on *http://127.0.0.1:5555* <br />
when starting the *mailing service* it should make a ```PUT``` request to ip:port where you're running the *service-registry* to register itself. <br />
```bash
PUT http://[service-registry-ip]:[service-registry-port]/mailing-service/1.0.3/5555
```
to keep this service alive you can program it to send the same request from above, every 20 seconds. <br />
to find this service (and eventually consume it), the client (consumer) has to make a ```GET``` request: <br />
```bash
GET http://[service-registry-ip]:[service-registry-port]/mailing-service/1
```
this will return a ***json*** with all the information to connect to this service. 

optionally, you can explicitly remove this service (maybe if it crashes or you're deliberately bringing it down) by sending a ```DELETE``` request. <br />
```bash
DELETE http://[service-registry-ip]:[service-registry-port]/mailing-service/1.0.3/5555
```
this is not very important, since after 30 seconds this service won't be available anyway.

happy hacking 🙂
