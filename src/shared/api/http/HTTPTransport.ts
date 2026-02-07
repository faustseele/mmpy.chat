import { globalBus } from "@/shared/lib/EventBus/EventBus.ts";
import { API_URL } from "../../config/urls.ts";
import {
  HttpMethod,
  HttpMethodType,
  HttpOptions,
  HttpOptionsNoMethod,
  HttpStatus,
  QueryDataType,
} from "./types.ts";
import { queryStringify } from "./utils.ts";

/**
 * @class HTTPTransport
 * HTTPTransport class handles HTTP requests.
 * Incapsulates XMLHttpRequest and works with Promise.
 */
export default class HTTPTransport {
  protected static API_URL = API_URL;
  protected endpoint: string;

  /* The enum-type is enclosed inside createMethod */
  public get: HttpMethodType = this.createMethod(HttpMethod.GET);
  public post: HttpMethodType = this.createMethod(HttpMethod.POST);
  public put: HttpMethodType = this.createMethod(HttpMethod.PUT);
  public delete: HttpMethodType = this.createMethod(HttpMethod.DELETE);

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Fabric method -> HTTP method
   * @Response -> a type required during the http call
   */
  private createMethod(method: HttpMethod): HttpMethodType {
    /* returns HTTP method */
    return <Response>(url: string, options: HttpOptionsNoMethod = {}) => {
      /* In case it's a GET request, adding a query string */
      if (method === HttpMethod.GET && options.data) {
        url += queryStringify(options.data as QueryDataType);
      }

      return this._request<Response>(url, { ...options, method });
    };
  }

  /**
   * @returns Promise, which is allowed with a typed response
   * or rejects with an error.
   */
  private _request = <ResponseType>(
    /* E.g. 'sign-up' */
    relativePath: string,
    options: HttpOptions,
  ): Promise<ResponseType> => {
    const { method, data, headers = {}, withCredentials = true } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      const fullUrl = HTTPTransport.API_URL + this.endpoint + relativePath;
      xhr.open(method, fullUrl);

      /* JSON – preferred response type */
      xhr.responseType = "json";

      /* Handling headers */
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      /* If no Formdata, set Content-Type header */
      if (!(data instanceof FormData) && data) {
        if (!headers["Content-Type"]) {
          xhr.setRequestHeader("Content-Type", "application/json");
        }
      }

      /* Catching the response */
      xhr.onload = () => {
        if (
          xhr.status >= HttpStatus.Ok &&
          xhr.status < HttpStatus.MultipleChoices
        ) {
          /* xhr should be a JSON object here */
          resolve(xhr.response as ResponseType);
        } else {
          reject({
            status: xhr.status,
            reason: xhr.response?.reason || xhr.statusText,
            response: xhr.response,
          });
        }
      };

      xhr.onabort = () => reject({ reason: "Request aborted" });
      xhr.onerror = () => reject({ reason: "Network error" });
      xhr.ontimeout = () => reject({ reason: "Request timed out" });

      xhr.timeout = options.timeout || 5000;
      xhr.withCredentials = withCredentials;

      try {
        if (method === HttpMethod.GET || !data) {
          try {
            xhr.send();
          } catch (e) {
            globalBus.emit("toast", {
              msg: "HTTPTransport: xhr.send failed",
              type: "error",
            });
            throw new Error(
              "HTTPTransport: xhr.send failed",
              e as ErrorOptions,
            );
          }
        } else {
          const body = data instanceof FormData ? data : JSON.stringify(data);
          xhr.send(body);
        }
      } catch (e) {
        globalBus.emit("toast", {
          msg: "HTTPTransport: xhr.send failed",
          type: "error",
        });
        throw new Error("HTTPTransport: xhr.send failed", e as ErrorOptions);
      }
    });
  };
}
