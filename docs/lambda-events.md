# Sample Lambda Events

A collection of Lambda events for local Lambda invocation.

**NOTE** When adding sample events, ensure you are not committing sensitive data. Some raw events may contain
tokens, keys, etc.

## Other Example Event Sources
* CloudWatch logs. Some Lambda functions will log out the event received in JSON format, just copy & paste.
* [SAM Local Generate Event](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-generate-event.html)
* Build your own, most events are just simple JSON documents.


## AppSync Authorization Event

```JSON
{
    "authorizationToken": "jwt-here",
    "requestContext": {
        "apiId": "aaaaaa123123123example123",
        "accountId": "111122223333",
        "requestId": "f4081827-1111-4444-5555-5cf4695f339f",
        "queryString": "mutation CreateEvent {}",
        "operationName": "MyQuery",
        "variables": {}
    }
}
```