export interface ErrorModel {
  code: string;
  status: number;
  response: {
    data: {
      message: string;
      name: string;
      error: string;
      statusCode: number;
    };
  };
}
