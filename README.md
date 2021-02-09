## Docker install with docker-compose
```bash
 git clone https://github.com/davidshumway/maldidb
 cd ./maldidb/
 # Use project.env.template to create project.env
 cp project.env.template project.env
 nano project.env
 # Build and run project
 docker-compose up --build
```

## Manual install
### Install prerequisites
- R
- IDBacApp (R library)
- PostgreSQL
    - Run `psql` and create an initial database:
```bash
 CREATE DATABASE <database>;
 CREATE USER <user> WITH PASSWORD '<password>';
 ALTER ROLE <user> SET client_encoding TO 'utf8';
 ALTER ROLE <user> SET default_transaction_isolation TO 'read committed';
 ALTER ROLE <user> SET timezone TO 'UTC';
 GRANT ALL PRIVILEGES ON DATABASE <database> TO <user>;
```

### Clone repository and start a test server
```bash
 git clone https://github.com/davidshumway/maldidb
 cd ./maldidb
 # Use project.env.template to create project.env
 cp project.env.template project.env
 nano project.env
 # Initialize environment variables and virtualenv
 source project.env
 sudo pip3 install virtualenv
 virtualenv venv -p python3
 source venv/bin/activate
 cd ./maldidb
 pip install -r requirements.txt
 # Run server
 python manage.py makemigrations
 python manage.py migrate
 python manage.py runserver
```

The application should now be available through a browser at
http://localhost:8000/.

A graph diagram of the application's models may then be generated
using ```./manage.py graph_models -a -g -o models.png```.

### Overview
- Mass data import from SQLite
- Search and browse data
- User and group management 
- Pipelines:
    - Bin peaks and cosine scoring for search and dendrograms
    - Replicates to collapsed spectra
    - Preprocessing
    - Upload spectra files

