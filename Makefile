.PHONY: all \
help local-init arm64 \
clean npmi build deploy \
lint unit test test-single coverage \
invoke invoke-out codegen

-include Makefile.env

ROOT_PATH=$(PWD)
SRC_PATH=$(ROOT_PATH)/src
BIN:=$(ROOT_PATH)/node_modules/.bin
ESLINT=$(BIN)/eslint
JEST=$(BIN)/jest
AMPLIFY=$(BIN)/amplify

APP_NAME?=cdk-appsync-boiler
AWS_REGION?=us-east-1
AWS_OPTIONS=

STACK_NAME?=CdkAppSyncBoilerStack
LAMBDA_EVENT?=events/event.json
LAMBDA_ENV?=.env.local.json

ifdef AWS_PROFILE
AWS_OPTIONS=--profile $(AWS_PROFILE)
endif

define ENV_LOCAL_JSON
{
  "GqlAuthorizer": {
    "JWT_PUBLIC_KEY": "public-key-here"
  }
}
endef
export ENV_LOCAL_JSON

define EVENT_LOCAL_JSON
{
    "authorizationToken": "ExampleAUTHtoken123123123",
    "requestContext": {
        "apiId": "aaaaaa123123123example123",
        "accountId": "111122223333",
        "requestId": "f4081827-1111-4444-5555-5cf4695f339f",
        "queryString": "mutation CreateEvent {}",
        "operationName": "MyQuery",
        "variables": {}
    }
}
endef
export EVENT_LOCAL_JSON


all: lint unit

# test: lint coverage ## Run code linter, unit tests and code coverage report
test: unit ## Run unit tests and code coverage report

help: ## Describe all available commands
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

clean: ## Delete local artifacts
	rm -rf coverage build cdk.out

npmi: ## Install npm dependencies
	npm i

arm64: ## Enable local Linux OS ARM64 support
	docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

codegen: ## Generate GraphQL code/types
	cd $(ROOT_PATH)/lib && $(AMPLIFY) codegen

jwt-keys: ## generate private & public keys for JWT purposes
	mkdir -p keys
	cd keys && ssh-keygen -t rsa -b 4096 -m PEM -f id_rsa -q -N ""
	cd keys && openssl rsa -in id_rsa -pubout -outform PEM -out id_rsa.pub

local-init: ## Generate initial local dev support files 
	@if [ ! -f ./Makefile.env ]; then \
		echo "AWS_PROFILE=default\nLAMBDA_NAME=StatusGet\nLAMBDA_EVENT=events/event.json\nTEST_NAME=test" > ./Makefile.env; \
	fi

	@if [ ! -f $(LAMBDA_ENV) ]; then \
		echo "$$ENV_LOCAL_JSON" > $(LAMBDA_ENV); \
	fi

	@if [ ! -d ./events ]; then \
		mkdir ./events && echo "$$EVENT_LOCAL_JSON" > ./events/event.json; \
	fi

lint: ## Run code linter
	@echo "Linting code..."
	@$(ESLINT) --quiet --ext .js,.ts $(SRC_PATH)
	@echo "Linting PASSED"

unit: ## Run unit tests
	@echo "Running unit tests..."
	@$(JEST)

coverage: ## Run unit tests & coverage report
	@echo "Running unit tests and coverage..."
	@$(JEST) --coverage

test-single: ## Run unit tests
	@echo "Running single unit test/suite..."
	@$(JEST) --coverage=false -t $(TEST_NAME)

invoke: build ## Invoke individual Lambda
	sam local invoke $(LAMBDA_NAME) $(SAM_PARAMS) -t ./cdk.out/$(STACK_NAME).template.json --event $(LAMBDA_EVENT) --env-vars $(LAMBDA_ENV) $(AWS_OPTIONS)

invoke-out: build ## Invoke individual Lambda & pipe logs to file 
	make invoke > invoke.out 2>&1

build: ## Build CDK app using local code
	cdk synth --no-staging

deploy: ## Deploy CDK app using local build
	cdk deploy $(STACK_NAME) --require-approval never --verbose $(AWS_OPTIONS)
