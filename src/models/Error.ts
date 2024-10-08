export interface ErrorModel {
  code: string;
  status: number;
  response: {
    data: {
      message: string;
      error: string;
      statusCode: number;
    };
  };
}
