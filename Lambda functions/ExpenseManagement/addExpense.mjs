import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
    const { userId, date, description, amount, category } = JSON.parse(event.body);

    const expenseId = uuidv4();

    const params = {
        TableName: "Expenses",
        Item: {
            expenseId,
            userId,
            date,
            description,
            amount,
            category,
        },
    };

    try {
        await dynamoDB.put(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Expense added successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};
