export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ResponseStatus = "SUCCESS" | "ERROR";

export type RequestHeader = {
  [key: string]: string;
};

export interface Connection {
  method: HttpMethods;
  endpoint: string;
  payload?: unknown;
  domain?: string;
}

export type RequestOptions = {
  connection: Connection;
};

export interface Response<T = unknown> {
  data: T;
  errorMessage: string | null;
  status: string;
}

export type Page<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};