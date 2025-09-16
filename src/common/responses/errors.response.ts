export interface ErrorsDetails {
  property: string | null;
  errors: string[];
}

export class ErrorsResponse {
  message: string;
  code: number | null = null;
  details?: Array<ErrorsDetails> = [];
}
