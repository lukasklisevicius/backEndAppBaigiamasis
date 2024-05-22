@echo off
set GOOGLE_PROJECT_ID=active-valve-423215-e9
set CLOUD_RUN_SERVICE=giftersms
set INSTANCE_CONNECTION_NAME=active-valve-423215-e9:europe-north1:asmeninislukoprojektas51640

gcloud run deploy %CLOUD_RUN_SERVICE% --image=gcr.io/active-valve-423215-e9/giftersms
    --add-cloudsql-instances=%INSTANCE_CONNECTION_NAME%
    --platform=managed
    --region=14
    --allow-unauthenticated
    --project=%GOOGLE_PROJECT_ID%
