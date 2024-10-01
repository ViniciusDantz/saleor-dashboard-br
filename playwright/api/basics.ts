import * as core from "@actions/core";
import { APIRequestContext } from "@playwright/test";

interface User {
  email: string;
  password: string;
}

interface TokenCreateResponse {
  tokenCreate: {
    token: string;
    refreshToken: string;
    errors: [
      {
        message: string;
        code: string;
      },
    ];
    user: {
      id: string;
    };
  };
}

interface ApiResponse<T> {
  data: T;
}

export class BasicApiService {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async logInUserViaApi(user: User): Promise<ApiResponse<TokenCreateResponse>> {
    const query = `mutation TokenAuth{
        tokenCreate(email: "${user.email}", password: "${user.password}") {
          token
          refreshToken
          errors: errors {
            code
            message
          }
          user {
            id
          }
        }
      }`;

    core.info(`Executing login request at: ${new Date().toISOString()}`);

    const loginResponse = await this.request.post(process.env.API_URL || "", {
      data: { query },
    });

    const loginResponseJson: { data: TokenCreateResponse } = await loginResponse.json();

    if (loginResponseJson.data.tokenCreate.errors?.length > 0) {
      const errorMessages = loginResponseJson.data.tokenCreate.errors
        .map(e => e.message)
        .join(", ");

      throw new Error(`Login failed: ${errorMessages}`);
    }

    return loginResponseJson as ApiResponse<TokenCreateResponse>;
  }
}
