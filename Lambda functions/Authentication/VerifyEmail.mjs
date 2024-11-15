// verifyEmail.mjs
import AWS from 'aws-sdk';

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event) => {
    const { email, code } = JSON.parse(event.body);

    const params = {
        ClientId: process.env.CLIENT_ID,
        ConfirmationCode: code,
        Username: email
    };

    try {
        await cognito.confirmSignUp(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email verified successfully' })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message })
        };
    }
};
