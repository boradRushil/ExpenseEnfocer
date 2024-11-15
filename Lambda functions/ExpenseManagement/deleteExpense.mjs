const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { userId, expenseId } = JSON.parse(event.body);
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            userId,
            expenseId
        }
    };

    try {
        await dynamoDb.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Expense deleted successfully' })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message })
        };
    }
};
