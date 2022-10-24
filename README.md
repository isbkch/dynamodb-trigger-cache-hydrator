[![CodeQL](https://github.com/isbkch/dynamodb-trigger-cache-hydrator/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/isbkch/dynamodb-trigger-cache-hydrator/actions/workflows/codeql-analysis.yml)

# DynamoDB Trigger Cache Hydrator

Built with Serverless Framework, this Lambda function attaches onto your DynamoDB table and triggers automatically after every DynamoDB operation (Insert, Modify, Remove) in order to hydrate your Redis cache
