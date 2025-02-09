# EU Made Simple

There are 3 main components to this repo. The first is the frontend, which is coded in typescript react. The second is the backend, which uses the fastAPI python library. The third is the EUMS Bot (or Simple Bot) which handles functions such as backend population, article generation, etc. 

To set up the repo, first `git clone`.

## Set up the frontend

Go to the frontend folder `cd frontend` and then `npm install` to download all required files. Then, run `npm start` to start the application. Make sure to use at least node version 20.


## Set up the backend

1. Set up a python venv: `python -m venv .`
2. Activate it: `venv\Scripts\activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Run the backend: `uvicorn eums_app.main:app --host 0.0.0.0 --port 8000 --reload`


## Set up EUMS Simple Bot

1. Follow the same steps as above to make a new venv
2. `pip install -r requiements.txt`
3. The bot is a command line application. You may use `python main.py --help` to see the main functionalities of the bot. If unsure, contact the admin (paulbeka).


## Spec and other useful information

This website is hosted on a docker image, and uses docker-compose to build it. Nginx is used for the frontend. 

The deployment of the website is done automatically using a github workflow. Due to server limitations (digital ocean is just too damn expensive!) the frontend is compiled/built in the (free to use!) github workflow, and artifacts are published to the server. The server uses published artifacts to create an nginx container.

If you want to test the full docker build locally, run `docker-compose up --build`. Make sure to have the windows/linux docker dependencies installed.


# Live APIs to collate data [FUTURE]

EU live APIs
- https://data.europarl.europa.eu/en/developer-corner/opendata-api
- https://data.europa.eu/en

Country specific live APIs (needs discussions):