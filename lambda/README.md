# Lambda Services Deployment Guide

## Node.js Runtime

- These Lambda functions are not compatible with Node.js versions higher than 16.x.

## Installation

Before deployment, you must install the necessary node modules:

### Steps for Deployment

1. Navigate to the AWS Lambda console.
2. Create a new Lambda function or select an existing one.
3. In the Function code section, upload your `index.js` file or edit the inline code editor directly.
4. Save your changes and deploy.

## Services

## Deployment of Order Service & Product Service

The Order and Product Services do not require any external dependencies and can be deployed directly to AWS Lambda.


### Rating Service

Navigate to the ratingService directory and run npm install:


Then, package and deploy as described above.

### Student Service

Navigate to the studentService directory and run npm install:


Then, package and deploy as described above.

## Additional Notes

- Ensure that you have set the correct permissions for the Lambda functions in the AWS IAM console.
- If your Lambda function requires access to other AWS services, ensure that the correct policies are attached to its role.
- For environment-specific configurations, use the AWS Lambda console or the AWS CLI to set environment variables.

## Support

For additional help or support, please contact vd376@scarletmail.rutgers.edu.
