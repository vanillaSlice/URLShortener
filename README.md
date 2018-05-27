# URL Shortener
A simple URL shortener built with [Flask](http://flask.pocoo.org/) and [MongoDB](https://www.mongodb.com/). A deployed version can be viewed [here](https://sliceurl.herokuapp.com/).

## Getting Started
Install [virtualenv](https://virtualenv.pypa.io/en/stable/#) to create an isolated environment by running:
```
sudo pip install virtualenv
```

Create a new virtual environment:
```
virtualenv venv
```

Activate the virtual environment:
```
. venv/bin/activate
```

Install app dependencies:
```
pip install -r requirements.txt
```

If you install any additional dependencies in the virtual environment, you should probably save them using:
```
pip freeze > requirements.txt
```

To deactivate the virtual environment when finished:
```
deactivate
```

## Configuration
The following properties can be configured:

* DEBUG - (default is `True`)
* SECRET_KEY - (default is `default secret key`)
* SERVER_NAME - (default is `localhost:5000`)
* MONGODB_DB - (default is `urlshortener`)
* MONGODB_HOST - (default is `localhost`)
* MONGODB_PORT - (default is `27017`)
* MONGODB_USERNAME - (default is empty)
* MONGODB_PASSWORD - (default is empty)
* SSL - (default is `True`)

URI style connections are also supported, just supply the URI as `MONGODB_HOST` (note that URI properties will take precedence).

To change these properties you can export them as environment variables or create a file `instance/config.py` (note that any environment variables take precedence).

## Running Locally
```
python run.py
```
Then point your browser to [localhost:5000](http://localhost:5000).

## Docker
Build the image:
```
docker build -t urlshortener .
```

Run the container:
```
docker run urlshortener
```
