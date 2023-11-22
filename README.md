
# Upload File By Minio(Docker Image)#

## Setup ##
* Clone project
* Run `docker compose up`

*   ### Minio Configuration ###
    You need to make a access key & secret key to use it<br/>
    typo in url `http://locahlhost:90001` and login: <br/>
    Username: `minio-root-user`<br/>
    Password: `minio-root-password`<br/>
    Click on left side bar on `Access Keys` -> `Create access key` <br/>
    The access key & secret key insert to .env file

* Run `npm run init`
* Run `npm run dev:front`
* Run `npm run dev:server`
  
