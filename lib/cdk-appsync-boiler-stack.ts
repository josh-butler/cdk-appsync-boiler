import {CfnOutput, Duration, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';

import {RemovalPolicy} from 'aws-cdk-lib';
import {Table, BillingMode, AttributeType} from 'aws-cdk-lib/aws-dynamodb';

import * as appsync from '@aws-cdk/aws-appsync-alpha';

export class CdkAppSyncBoilerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ==== DynamoDB ====
    const entityTable = new Table(this, 'EntityTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY, // set RETAIN for prod?
      pointInTimeRecovery: false, // set TRUE for prod?
      partitionKey: {name: 'pk', type: AttributeType.STRING},
      sortKey: {name: 'sk', type: AttributeType.STRING},
    });

    entityTable.addGlobalSecondaryIndex({
      indexName: 'byTypeName',
      partitionKey: {name: '__typeName', type: AttributeType.STRING},
      sortKey: {name: 'sk', type: AttributeType.STRING},
    });

    // ==== AppSync ====
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'IotData',
      schema: appsync.Schema.fromAsset('./lib/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: false,
      logConfig: {
        excludeVerboseContent: false,
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
    });

    const deviceDS = api.addDynamoDbDataSource('DeviceDS', entityTable);

    deviceDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createDevice',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/createDevice.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/createDevice.res.vtl'
      ),
    });

    deviceDS.createResolver({
      typeName: 'Query',
      fieldName: 'getDevice',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getDevice.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getDevice.res.vtl'
      ),
    });

    // ==== Lambda ====
    const deviceGetResolver = new NodejsFunction(this, 'DeviceGetResolver', {
      memorySize: 128,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: './src/handlers/device-get-resolver.ts',
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });

    // ==== Outputs ====
    new CfnOutput(this, 'DeviceGetResolverLambdaArn', {
      description: 'DeviceGetResolver Function ARN',
      value: deviceGetResolver.functionArn,
    });

    new CfnOutput(this, 'ApiId', {
      description: 'AppSync API ID',
      value: api.apiId,
    });

    new CfnOutput(this, 'ApiUrl', {
      description: 'GraphQL URL',
      value: api.graphqlUrl,
    });

    new CfnOutput(this, 'ApiKey', {
      description: 'API Key',
      value: api.apiKey || '',
    });
  }
}
