import AWS from 'aws-sdk';

const sns = new AWS.SNS();

export const handler = async (event) => {
    const { email, message } = JSON.parse(event.body);
    const params = {
        Message: message,
        Subject: 'Expense Limit Exceeded',
        TopicArn: process.env.SNS_TOPIC_ARN
    };

    try {
        await sns.publish(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Notification sent successfully' })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message })
        };
    }
};
