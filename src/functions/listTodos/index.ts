import { APIGatewayProxyHandler } from 'aws-lambda'
import { document } from '../../utils'

export const handle: APIGatewayProxyHandler = async ({ pathParameters }) => {
  const { userid } = pathParameters

  const user_id = userid

  const response = await document.query({
    TableName: "users_todos",
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id,
    },
  }).promise()

  const userTodos = response.Items

  if (userTodos) {
    return {
      statusCode: 201,
      body: JSON.stringify(
        {
          message: 'Showing user todo list:',
          todos: userTodos
        }
      ),
      headers: {
        "Content-Type": "application/json"
      }
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      message: "User not found!",
    }),
  }
}
