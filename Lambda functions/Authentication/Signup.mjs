// signup.mjs
import AWS from 'aws-sdk';

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event) => {
    const { email, password } = JSON.parse(event.body);

    const params = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
        TemporaryPassword: password,
        UserAttributes: [
            { Name: 'email', Value: email }
        ]
    };

    try {
        await cognito.adminCreateUser(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully. Please check your email for verification.' })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message })
        };
    }
};
