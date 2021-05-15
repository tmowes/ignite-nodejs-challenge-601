import { APIGatewayProxyHandler } from 'aws-lambda'
import { document } from '../../utils'
import { v4 as uuidV4 } from 'uuid'

import { CreateTodoDTO, SaveTodoDTO } from "./types"

export const handle: APIGatewayProxyHandler = async ({ body, pathParameters }) => {
  const { userid } = pathParameters
  const { title, deadline } = JSON.parse(body) as CreateTodoDTO

  const deadlineISO = new Date(deadline).toISOString()

  const data: SaveTodoDTO = {
    id: uuidV4(),
    user_id: userid,
    title,
    done: false,
    deadline: deadlineISO,
  }

  await document.put({
    TableName: 'users_todos',
    Item: { ...data }
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify(
      {
        message: 'New todo created!',
        todo: { ...data }
      }
    ),
    headers: {
      "Content-Type": "application/json"
    }
  }
}
