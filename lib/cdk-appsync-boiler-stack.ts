import {CfnOutput, Duration, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {CfnSecret} from 'aws-cdk-lib/aws-secretsmanager';
import {RemovalPolicy} from 'aws-cdk-lib';
import {Table, BillingMode, AttributeType} from 'aws-cdk-lib/aws-dynamodb';

import * as iam from 'aws-cdk-lib/aws-iam';
import * as appsync from '@aws-cdk/aws-appsync-alpha';

export class CdkAppSyncBoilerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ==== Secrets ====
    // // manually populate this secret after initial stack deploy
    // const privateKeySecret = new CfnSecret(this, 'PrivateKeySecret', {
    //   name: 'app/jwt/privateKey',
    //   description: 'JWT private key',
    //   secretString: '',
    // });

    // manually populate this secret after initial stack deploy
    const publicKeySecret = new CfnSecret(this, 'PublicKeySecret', {
      name: 'app/jwt/publicKey',
      description: 'JWT public key',
    });

    const getPublicKeySecretPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [publicKeySecret.ref],
      actions: ['secretsmanager:GetSecretValue'],
    });

    // ==== DynamoDB ====
    const entityTable = new Table(this, 'EntityTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY, // set RETAIN for prod?
      pointInTimeRecovery: false, // set TRUE for prod?
      partitionKey: {name: 'pk', type: AttributeType.STRING},
      sortKey: {name: 'sk', type: AttributeType.STRING},
    });

    entityTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {name: '_et', type: AttributeType.STRING},
      sortKey: {name: 'sk', type: AttributeType.STRING},
    });

    // ==== Lambda ====
    const gqlAuthorizer = new NodejsFunction(this, 'GqlAuthorizer', {
      memorySize: 128,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: './src/handlers/gql-authorizer.ts',
      environment: {
        SECRET_ID: publicKeySecret.ref,
      },
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });
    gqlAuthorizer.addToRolePolicy(getPublicKeySecretPolicy);
    gqlAuthorizer.addPermission('appsync', {
      principal: new iam.ServicePrincipal('appsync.amazonaws.com'),
      action: 'lambda:InvokeFunction',
    });

    const deviceGetResolver = new NodejsFunction(this, 'DeviceGetResolver', {
      memorySize: 128,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: './src/handlers/device-get-resolver.ts',
      environment: {
        ENTITY_TABLE: entityTable.tableName,
      },
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });
    entityTable.grantReadData(deviceGetResolver);

    /**
     * Util function that generates a JWT using a private key stored
     * in secrets manaager.
     */
    const generateJwt = new NodejsFunction(this, 'GenerateJwt', {
      memorySize: 128,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: './src/handlers/generate-jwt.ts',
      environment: {
        SECRET_ID: publicKeySecret.ref, // live version should use private id
      },
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });
    generateJwt.addToRolePolicy(getPublicKeySecretPolicy);

    // ==== AppSync ====
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'IotData',
      schema: appsync.Schema.fromAsset('./lib/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: gqlAuthorizer,
            resultsCacheTtl: Duration.seconds(300),
            // block requests if Authorization header does not resemble a JWT
            validationRegex: '^[A-Za-z0-9-_]*\\.[A-Za-z0-9-_]*\\.[A-Za-z0-9-_]*$' // eslint-disable-line
          },
        },
      },
      xrayEnabled: false,
      logConfig: {
        excludeVerboseContent: false,
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
    });

    // = Data Sources
    const deviceDS = api.addDynamoDbDataSource('DeviceDS', entityTable);
    const deviceLambdaDS = api.addLambdaDataSource(
      'DeviceLambdaDS',
      deviceGetResolver
    );

    // = Resolvers
    deviceLambdaDS.createResolver({
      typeName: 'Query',
      fieldName: 'getDeviceFn',
    });

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

    deviceDS.createResolver({
      typeName: 'Query',
      fieldName: 'listDevices',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/listDevices.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/listDevices.res.vtl'
      ),
    });

    // = Sensors
    deviceDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createSensor',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/createSensor.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/createSensor.res.vtl'
      ),
    });

    deviceDS.createResolver({
      typeName: 'Query',
      fieldName: 'getDeviceSensors',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getDeviceSensors.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getDeviceSensors.res.vtl'
      ),
    });

    // ==== Outputs ====
    new CfnOutput(this, 'GqlAuthorizerLambdaArn', {
      description: 'GqlAuthorizer Function ARN',
      value: gqlAuthorizer.functionArn,
    });

    new CfnOutput(this, 'DeviceGetResolverLambdaArn', {
      description: 'DeviceGetResolver Function ARN',
      value: deviceGetResolver.functionArn,
    });

    new CfnOutput(this, 'GenerateJwtLambdaArn', {
      description: 'GenerateJwt Function ARN',
      value: generateJwt.functionArn,
    });

    new CfnOutput(this, 'ApiId', {
      description: 'AppSync API ID',
      value: api.apiId,
    });

    new CfnOutput(this, 'ApiUrl', {
      description: 'GraphQL URL',
      value: api.graphqlUrl,
    });

    // new CfnOutput(this, 'ApiKey', {
    //   description: 'API Key',
    //   value: api.apiKey || '',
    // });
  }
}
