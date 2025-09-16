export interface ErrorsDetails {
  property: string | null;
  errors: string[];
}

export class ErrorsResponse {
  message: string;
  details?: Array<ErrorsDetails> = [];
}
