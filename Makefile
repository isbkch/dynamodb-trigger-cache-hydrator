.ONESHELL:

AWS_REGION  ?= us-east-1
AWS_PROFILE ?= mbp-16-cli
SHELL       := /bin/bash
COMMAND     ?= none ### specify the command to pass to sub-makefiles (build|test)
APP_NAME	?= CacheHydrator
S3_PREFIX    = winthecloud/$(APP_NAME) # used to organize the build artifacts in S3

STACK_NAME   = $(APP_NAME)-qa

# AWS SAM commands
CMD_SAM_BUILD := make sam-build

#########################################################################
#                     Development                                       #
#########################################################################

accelerate:
	sam sync --watch --stack-name $(STACK_NAME) --region $(AWS_REGION) --profile $(AWS_PROFILE)

sync-logs:
	sam logs --stack-name $(STACK_NAME) --tail --region $(AWS_REGION) --profile $(AWS_PROFILE)

validate-template:
	sam validate

build-local-functions:
	rm -Rf .aws-sam/build/
	sam build

invoke-local:
	sam local invoke CacheHydratorFunction --region $(AWS_REGION)

invoke-local-debug:
	sam local invoke CacheHydratorFunction --debug-port 5858 --region $(AWS_REGION)


#########################################################################
#                     Sandbox                                           #
#########################################################################

deploy:
	${CMD_SAM_BUILD}
	sam deploy \
	--stack-name $(STACK_NAME) \
	--resolve-s3 --s3-prefix $(S3_PREFIX) \
	--capabilities CAPABILITY_IAM \
	--region $(AWS_REGION) \
	--no-fail-on-empty-changeset \
	--profile $(AWS_PROFILE)

destroy:
	sam delete \
	--stack-name $(STACK_NAME) \
	--region $(AWS_REGION) \
	--profile $(AWS_PROFILE)

#########################################################################
#                     Docker Related                                     #
#########################################################################

install-packages:
	$(CMD_INSTALL_PKG)
build:
	${CMD_BUILD_CONTAINER}
remove:
	$(CMD_REMOVE_CONTAINER)
run:
	$(CMD_RUN_CONTAINER)

update-datadog-macro:
	aws cloudformation update-stack \
  		--stack-name datadog-serverless-macro \
  		--template-url https://datadog-cloudformation-template.s3.amazonaws.com/aws/serverless-macro/latest.yml \
  		--capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_IAM \
		--region $(AWS_REGION)
