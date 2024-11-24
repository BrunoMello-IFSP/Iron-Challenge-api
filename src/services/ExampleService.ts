interface IResponse {
  text: string;
}
export class ExampleService {
  public async execute(): Promise<IResponse> {
    const text = 'Hello World';

    return { text };
  }
}
