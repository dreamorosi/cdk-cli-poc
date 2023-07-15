/* class TestStack implements ICloudAssemblyDirectoryProducer {
  public app: App;
  public cli: AwsCdkCli;
  public stack: Stack;

  public constructor(testName: string) {
    this.app = new App();
    this.stack = new Stack(this.app, this.#generateUniqueName(testName));
    this.cli = AwsCdkCli.fromCloudAssemblyDirectoryProducer(this);
  }

  async produce(_context: Record<string, any>) {
    return this.app.synth().directory;
  }

  async synth() {
    await this.cli.synth({
      stacks: [this.stack.stackName],
    });
  }

  #generateUniqueName = (resourceName: string): string => {
    const runtime: string = process.env.RUNTIME || "nodejs18x";
    const uuid = randomUUID();

    return `${RESOURCE_NAME_PREFIX}-${runtime}-${uuid.substring(
      0,
      5
    )}-${resourceName}`.substring(0, 64);
  };
}

const testStack = new TestStack("makeFnIdempotent"); */
