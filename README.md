# Storm Talents

http://storm-talents.s3-website.eu-central-1.amazonaws.com

## Deploy

``` bash
    yarn run build
    aws s3 sync dist/ s3://storm-talents/
```

## Todo

1. URL/Hash
    - /#Sgt.Hammer-4K79A
    - Could use hero release date as index and from that create a ID
    - #GL6FZ8
    - Use typing friendly characters which encodes 'any' series
2. Search
    1. Add search terms to index
    2. Build search tree(Radix tree?)
3. Icons should be hashed
