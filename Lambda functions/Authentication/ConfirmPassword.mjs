// confirmPassword.mjs
import AWS from 'aws-sdk';

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event) => {
    const { email, code, newPassword } = JSON.parse(event.body);

    const params = {
        ClientId: process.env.CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword
    };

    try {
        await cognito.confirmForgotPassword(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Password reset successfully' })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message })
        };
    }
};
