# cdk-appsync-boiler

A CDK AppSync example app


## Related Documentation

### AppSync
* [https://docs.aws.amazon.com/appsync/latest/devguide/appsync-dg.pdf](https://docs.aws.amazon.com/appsync/latest/devguide/appsync-dg.pdf)

## Development

### Makefile
A Makefile is provided in the project root directory and is used to run helper commands during local development.

Default environment variables used by the Makefile can be overwritten by creating a `Makefile.env` file as shown below. This file is **OPTIONAL** and should **NOT** be committed into version control.

```bash
AWS_PROFILE=default
TEST_NAME=mytest
...
```

**Usage Examples**
```bash
make test
```

| Command     | Description                                  |
| ----------- | -------------------------------------------- |
| help        | Describe all available commands              |
| npmi        | Install npm dependencies                     |
| test        | Run unit tests and code coverage report      |
| test-single | Run a single unit test/suite                 |
| coverage    | Run unit tests & coverage report             |
| unit        | Run unit tests                               |
| clean       | Delete local artifacts                       |
| local-init  | Generate initial local dev support files     |
| deploy      | Deploy CDK app using local build             |
| invoke      | Invoke individual Lambda                     |
| invoke-out  | Invoke individual Lambda & pipe logs to file |


### Code Linting

ESLint is used for static code analysis. It is configured to use `Google's TypeScript style guide` (gts).
Run `make lint` to view a project level static code analysis.
