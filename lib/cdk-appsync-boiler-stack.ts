import {CfnOutput, Duration, ScopedAws, Stack, StackProps} from 'aws-cdk-lib';
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

    // ==== Parameters ====
    const {region, partition, accountId} = new ScopedAws(this);

    // ==== Secrets ====
    // // manually populate this secret after initial stack deploy
    // const privateKeySecret = new CfnSecret(this, 'PrivateKeySecret', {
    //   name: 'app/jwt/privateKey',
    //   description: 'JWT private key',
    //   secretString: '',
    // });

    // manually populate this secret after initial stack deploy
    const publicKeySecret = new CfnSecret(this, 'PublicKeySecret', {
      name: '/app/jwt/publicKey',
      description: 'JWT public key',
    });

    const getPublicKeySecretPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [publicKeySecret.ref],
      actions: ['secretsmanager:GetSecretValue'],
    });

    // ==== SSM Params ====
    const ssmParamPrefix = '/group/app/keys'; // param store dir to store all data source pwds under

    const ssmParameterDescribePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['ssm:DescribeParameters'],
    });

    const ssmParameterCrudPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [
        `arn:${partition}:ssm:${region}:${accountId}:parameter${ssmParamPrefix}/*`,
      ],
      actions: [
        'ssm:PutParameter',
        'ssm:GetParameter',
        'ssm:GetParameters',
        'ssm:DeleteParameter',
        'ssm:GetParameterHistory',
        'ssm:DeleteParameters',
        'ssm:GetParametersByPath',
      ],
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
      partitionKey: {name: 'GSI1pk', type: AttributeType.STRING},
      sortKey: {name: 'GSI1sk', type: AttributeType.STRING},
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

    const usersGetResolver = new NodejsFunction(this, 'UsersGetResolver', {
      memorySize: 128,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: './src/handlers/users-get-resolver.ts',
      environment: {
        ENTITY_TABLE: entityTable.tableName,
      },
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });
    entityTable.grantReadData(usersGetResolver);

    const dataSourcePut = new NodejsFunction(this, 'DataSourcePut', {
      memorySize: 128,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: './src/handlers/data-source-put.ts',
      environment: {
        ENTITY_TABLE: entityTable.tableName,
        PARAMS_PREFIX: ssmParamPrefix,
      },
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });
    entityTable.grantReadWriteData(dataSourcePut);
    dataSourcePut.addToRolePolicy(ssmParameterDescribePolicy);
    dataSourcePut.addToRolePolicy(ssmParameterCrudPolicy);

    const dataSourceDelete = new NodejsFunction(this, 'DataSourceDelete', {
      memorySize: 128,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: './src/handlers/data-source-delete.ts',
      environment: {
        ENTITY_TABLE: entityTable.tableName,
        PARAMS_PREFIX: ssmParamPrefix,
      },
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });
    entityTable.grantReadWriteData(dataSourceDelete);
    dataSourcePut.addToRolePolicy(ssmParameterDescribePolicy);
    dataSourcePut.addToRolePolicy(ssmParameterCrudPolicy);

    // replaced w/ VTL - 1
    // const nodeGetResolver = new NodejsFunction(this, 'NodeGetResolver', {
    //   memorySize: 128,
    //   timeout: Duration.seconds(30),
    //   runtime: Runtime.NODEJS_14_X,
    //   handler: 'handler',
    //   entry: './src/handlers/node-get-resolver.ts',
    //   environment: {
    //     ENTITY_TABLE: entityTable.tableName,
    //   },
    //   bundling: {
    //     minify: true,
    //     externalModules: ['aws-sdk'],
    //   },
    // });
    // entityTable.grantReadData(nodeGetResolver);

    // replaced w/ VTL - 2
    // const nodeEdgeGetResolver = new NodejsFunction(
    //   this,
    //   'NodeEdgeGetResolver',
    //   {
    //     memorySize: 128,
    //     timeout: Duration.seconds(30),
    //     runtime: Runtime.NODEJS_14_X,
    //     handler: 'handler',
    //     entry: './src/handlers/node-edge-get-resolver.ts',
    //     environment: {
    //       ENTITY_TABLE: entityTable.tableName,
    //     },
    //     bundling: {
    //       minify: true,
    //       externalModules: ['aws-sdk'],
    //     },
    //   }
    // );
    // entityTable.grantReadData(nodeEdgeGetResolver);

    // replaced VTL - 3
    const orgsGetResolver = new NodejsFunction(this, 'OrgsGetResolver', {
      memorySize: 128,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: './src/handlers/orgs-get-resolver.ts',
      environment: {
        ENTITY_TABLE: entityTable.tableName,
      },
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });
    entityTable.grantReadData(orgsGetResolver);

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

    const usersLambdaDS = api.addLambdaDataSource(
      'UsersLambdaDS',
      usersGetResolver
    );

    const orgsLambdaDS = api.addLambdaDataSource(
      'OrgsLambdaDS',
      orgsGetResolver
    );

    // // replaced w/ VTL - 1
    // const nodeLambdaDS = api.addLambdaDataSource(
    //   'NodeLambdaDS',
    //   nodeGetResolver
    // );

    // // replaced w/ VTL - 2
    // const nodeEdgeLambdaDS = api.addLambdaDataSource(
    //   'NodeEdgeLambdaDS',
    //   nodeEdgeGetResolver
    // );

    // = Resolvers
    deviceLambdaDS.createResolver({
      typeName: 'Query',
      fieldName: 'getDeviceFn',
    });

    usersLambdaDS.createResolver({
      typeName: 'Org',
      fieldName: 'users',
    });

    orgsLambdaDS.createResolver({
      typeName: 'Query',
      fieldName: 'getOrgs',
    });

    // replaced w/ VTL - 1
    // nodeLambdaDS.createResolver({
    //   typeName: 'Query',
    //   fieldName: 'node',
    // });

    // replaced w/ VTL - 2
    // nodeEdgeLambdaDS.createResolver({
    //   typeName: 'UserEdge',
    //   fieldName: 'node',
    // });

    // Lambda option above - 1
    deviceDS.createResolver({
      typeName: 'Query',
      fieldName: 'node',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getNode.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getNode.res.vtl'
      ),
    });

    // Lambda option above - 2
    deviceDS.createResolver({
      typeName: 'UserEdge',
      fieldName: 'node',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getUserNode.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getUserNode.res.vtl'
      ),
    });

    deviceDS.createResolver({
      typeName: 'OrgEdge',
      fieldName: 'node',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getOrgNode.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getOrgNode.res.vtl'
      ),
    });

    deviceDS.createResolver({
      typeName: 'Query',
      fieldName: 'org',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getOrg.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/getOrg.res.vtl'
      ),
    });

    // Lambda option above - 3
    // deviceDS.createResolver({
    //   typeName: 'Query',
    //   fieldName: 'getOrgs',
    //   requestMappingTemplate: appsync.MappingTemplate.fromFile(
    //     './lib/resolvers/getOrgs.req.vtl'
    //   ),
    //   responseMappingTemplate: appsync.MappingTemplate.fromFile(
    //     './lib/resolvers/getOrgs.res.vtl'
    //   ),
    // });

    // deviceDS.createResolver({
    //   typeName: 'Query',
    //   fieldName: 'users',
    //   requestMappingTemplate: appsync.MappingTemplate.fromFile(
    //     './lib/resolvers/getOrgUsers.req.vtl'
    //   ),
    //   responseMappingTemplate: appsync.MappingTemplate.fromFile(
    //     './lib/resolvers/getOrgUsers.res.vtl'
    //   ),
    // });

    deviceDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createOrg',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/createOrg.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/createOrg.res.vtl'
      ),
    });

    deviceDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createUser',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/createUser.req.vtl'
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        './lib/resolvers/createUser.res.vtl'
      ),
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

    new CfnOutput(this, 'DataSourcePutLambdaArn', {
      description: 'DataSourcePut Function ARN',
      value: dataSourcePut.functionArn,
    });

    new CfnOutput(this, 'DataSourceDeleteLambdaArn', {
      description: 'DataSourceDelete Function ARN',
      value: dataSourceDelete.functionArn,
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
