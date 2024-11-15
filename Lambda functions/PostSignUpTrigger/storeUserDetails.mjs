import AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
    const userId = event.request.userAttributes.sub;
    const email = event.request.userAttributes.email;
    const expenseLimit = 500; // Default limit

    const params = {
        TableName: process.env.USERS_TABLE,
        Item: {
            userId: userId,
            email: email,
            expenseLimit: expenseLimit,
            createdAt: new Date().toISOString()
        }
    };

    try {
        await dynamoDB.put(params).promise();
        console.log(`User ${userId} stored in DynamoDB.`);
    } catch (error) {
        console.error(`Error storing user ${userId}: ${error}`);
    }

    return event;
};
