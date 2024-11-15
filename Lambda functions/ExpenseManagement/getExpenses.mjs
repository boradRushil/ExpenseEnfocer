import AWS from 'aws-sdk';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {

    console.log('Received event:', event);

    const userId = event.queryStringParameters?.userId;
    const params = {
        TableName: "Expenses",
        IndexName: "UserIdIndex",
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };

    try {
        const result = await dynamoDb.query(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message })
        };
    }
};
