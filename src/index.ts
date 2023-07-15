import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {
  try {
    const res = await client.send(
      new ScanCommand({
        TableName: "my-table",
      })
    );

    console.log(res.Count);

    return {
      statusCode: 200,
      body: JSON.stringify(res.Count),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong!");
  }
};
