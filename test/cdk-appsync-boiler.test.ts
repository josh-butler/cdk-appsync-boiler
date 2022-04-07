import * as cdk from 'aws-cdk-lib';
import {Template} from 'aws-cdk-lib/assertions';
import {CdkAppSyncBoilerStack} from '../lib/cdk-appsync-boiler-stack';

test('stack-created', () => {
  const app = new cdk.App();
  const stack = new CdkAppSyncBoilerStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    MemorySize: 128,
  });
});
