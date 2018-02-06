# CaptionThis

## Setup
1. Install Docker
2. Clone repo: ```git clone https://github.com/justin-cotarla/CaptionThis.git```
3. Setup npm for frontend and backend from respective folders: ```npm install```

## Note: Hot-reloading on Windows
Hot-reloading does not work on Windows. To fix this issue, first install ```docker-windows-volume-watcher``` (requires ```python2``` or ```python3```):
```
pip install docker-windows-volume-watcher
pip install docker==2.7.0
```
Then, run the script from your terminal: 
```
docker-volume-watcher
``` 

Hot-reloading should work now.

## Running
Start docker from project root: ```docker-compose up --build```

Development server URLs:
* Frontend: http://localhost
* Backend: https://localhost:16085/api/

Press ctrl-c to shutdown.

#### Contributors
* Justin Cotarla - 40027609
* Yasmine Ghassemi - 40028336
* Derek Yu - 40022110
* Constantina Roumeliotis - 40002536
* Jeremiah-David Wreh - 40028325
* Krishna Patel - 40031019
* Maher Hassanain - 26215173
* Zachary Bys - 40031629