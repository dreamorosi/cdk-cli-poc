import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { App, Stack, RemovalPolicy, Duration } from "aws-cdk-lib";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { RESOURCE_NAME_PREFIX } from "./constants";
import {
  AwsCdkCli,
  ICloudAssemblyDirectoryProducer,
} from "@aws-cdk/cli-lib-alpha";

class MyProducer implements ICloudAssemblyDirectoryProducer {
  public app: App;
  public stack: Stack;
  #stackName: string;

  public constructor(stackName: string, context?: Record<string, any>) {
    this.#stackName = stackName;
    this.app = new App();
    this.stack = new Stack(this.app, this.#stackName);
  }

  async produce() {
    return this.app.synth().directory;
  }
}
const producer = new MyProducer("cdk-poc-nodejs18x-6e3e8-makeFnIdempotent");
const cli = AwsCdkCli.fromCloudAssemblyDirectoryProducer(producer);

describe("main", () => {
  beforeAll(async () => {
    const table = new Table(producer.stack, "my-table", {
      tableName: "my-table",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const nodeJsFunction = new NodejsFunction(producer.stack, "my-function", {
      runtime: Runtime.NODEJS_18_X,
      functionName: "my-function-1234",
      entry: join(__dirname, `./src/index.ts`),
      timeout: Duration.seconds(30),
      handler: "handler",
      environment: {
        IDEMPOTENCY_TABLE_NAME: table.tableName,
      },
      logRetention: RetentionDays.ONE_DAY,
    });
    table.grantReadWriteData(nodeJsFunction);

    await cli.synth({
      stacks: [producer.stack.stackName],
    });
  });

  it("should create a stack", () => {
    expect(producer.stack).toBeDefined();
  });
});
