## Using Kafka

Start by entering `docker-compose up` into a shell to start the `zookeeper` and `kafka` docker images. Zookeeper manages
kafka topics, consumer groups, consumer replicas. To stop the `zookeeper` and `kafka` docker containers simply type
`docker stop kafka` and `docker stop zookeeper` followed by `docker rm -vf kafka` and `docker rm -vf zookeeper`.

Enter `npm run start:fitbitConsumer` in a separate terminal to spin up the consumer. Then, open a new terminal window
again and start the producer by using `npm run start:fitbitProducer`. You should see Fitbit messages being sent over the
producer terminal and received in consumer terminal. If you check the database under the user "Patrick Neggie" you
should see steps being updated in the `state.fitbitSteps` property. Run `node tests/loadUsers.test.js` to reset the
databases' values.

## Using Kafka scripts

Inside the `scripts/` directory you should find a number of helpful scripts that Kafka provides for us. You MUST have
the docker images for both `kafka` and `zookeeper` running for these scripts to work properly. To do so, simply type:
`docker-compose up`. The `create-topic.sh` script allows us to create new topics. Different topics in Kafka allow us to
separate the queueing process between separate pieces of data. For example, Fitbit data and Apple Watch data would
likely be two separate topics.

## Using the API

Start the API by entering `npm run start:server` and open `localhost:9090` in your browser. You should see a login
window. Create a new user and then click authenticate with Fitbit to be taken to the Fitbit authentication page. The
database should update with your access token, refresh token, and FitbitID inside the state variable.
