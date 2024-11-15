// forgotPassword.mjs
import AWS from 'aws-sdk';

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event) => {
    const { email } = JSON.parse(event.body);

    const params = {
        ClientId: process.env.CLIENT_ID,
        Username: email
    };

    try {
        await cognito.forgotPassword(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Password reset code sent to your email' })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message })
        };
    }
};
