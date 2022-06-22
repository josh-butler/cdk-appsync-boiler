/**
 * CDK Construct that creates resources that support Integration tests
 * Includes:
 *  - Lambda Function
 */
import {CfnOutput, Duration, ScopedAws, aws_lambda} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Table} from 'aws-cdk-lib/aws-dynamodb';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';

export interface IntTestSupportProps {
  /**
   * Required. DynamoDB table.
   */
  readonly entityTable: Table;
}

export class IntTestSupport extends Construct {
  constructor(scope: Construct, id: string, props: IntTestSupportProps) {
    super(scope, id);

    // ==== Constants ====
    const {stackName} = new ScopedAws(this);
    const {entityTable} = props;

    // ==== Lambda ====
    /**
     * Initializes DDB and returns test JWTs
     */
    const integrationTestInit = new NodejsFunction(
      this,
      'IntegrationTestInit',
      {
        memorySize: 128,
        timeout: Duration.seconds(300), // TODO: Increase to 900
        runtime: aws_lambda.Runtime.NODEJS_14_X,
        architecture: aws_lambda.Architecture.ARM_64,
        handler: 'handler',
        entry: './src/handlers/int-test-init.ts',
        environment: {
          ENTITY_TABLE: entityTable.tableName,
        },
        bundling: {
          minify: true,
          externalModules: ['aws-sdk'],
        },
      }
    );
    entityTable.grantReadWriteData(integrationTestInit);

    new CfnOutput(this, 'IntegrationTestInitArn', {
      description: 'IntegrationTestInit Function ARN',
      value: integrationTestInit.functionArn,
      exportName: `${stackName}-IntegrationTestInitArn`,
    });
  }
}
