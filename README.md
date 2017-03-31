# Storm Talents

http://storm-talents.s3-website.eu-central-1.amazonaws.com

## Deploy

``` bash
    yarn run build
    aws s3 sync dist/ s3://storm-talents/
```
