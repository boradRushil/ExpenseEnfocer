// login.mjs
import AWS from 'aws-sdk';

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event) => {
    const { email, password } = JSON.parse(event.body);
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    };

    try {
        const response = await cognito.initiateAuth(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ token: response.AuthenticationResult.IdToken })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message })
        };
    }
};
