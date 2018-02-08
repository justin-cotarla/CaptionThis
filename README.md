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

## Coding Process for Repo

1. Create new branch locally
  * Branch name should be a condensed version of the task name
  * Use ```git checkout -b branch_name``` to create branch locally

2. Commit changes to branch
  * ```git add name_of_file_to_add``` to add file (* for all files)
  * ```git commit -m "commit_message"``` to commit changes 
  * commit_message should start with the task number in square brackets
  
3. Push changes to branch
  * ```push remote origin branch_name```
  
4. Pull request
  * When the task is finished, open a pull request on the branch
  * Set someone as a reviewer
  * Once the review is complete, merge into dev.

#### Contributors
* Justin Cotarla - 40027609
* Yasmine Ghassemi - 40028336
* Derek Yu - 40022110
* Constantina Roumeliotis - 40002536
* Jeremiah-David Wreh - 40028325
* Krishna Patel - 40031019
* Maher Hassanain - 26215173
* Zachary Bys - 40031629
