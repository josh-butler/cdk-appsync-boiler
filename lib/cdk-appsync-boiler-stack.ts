import {CfnOutput, Duration, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';

export class CdkAppSyncBoilerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userGetResolver = new NodejsFunction(this, 'UserGetResolver', {
      memorySize: 128,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: './src/handlers/user-get-resolver.ts',
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });

    // ==== Outputs ====
    new CfnOutput(this, 'UserGetResolverLambdaArn', {
      description: 'UserGetResolver Function ARN',
      value: userGetResolver.functionArn,
    });
  }
}
