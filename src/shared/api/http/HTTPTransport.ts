import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
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
    /* e.g: '/signUp' */
    path: string,
    options: HttpOptions,
  ): Promise<ResponseType> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fullUrl = HTTPTransport.API_URL + this.endpoint + path;

      this._setupRequest(xhr, fullUrl, options);
      this._setupHeaders(xhr, options);
      this._attachRequestListeners(xhr, resolve, reject);
      this._send(xhr, options);
    });
  };

  /** configures basic XHR parameters */
  private _setupRequest = (
    xhr: XMLHttpRequest,
    fullUrl: string,
    options: HttpOptions,
  ) => {
    const { method, withCredentials = true } = options;

    /* inits new request */
    xhr.open(method, fullUrl);

    xhr.responseType = "json";
    xhr.timeout = options.timeout || 5000;
    xhr.withCredentials = withCredentials;
  };

  /** handles header injection and Content-Type inference */
  private _setupHeaders = (xhr: XMLHttpRequest, options: HttpOptions) => {
    const { headers = {}, data } = options;

    /* sets request headers */
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    /* if plain body -> set mime-type header */
    if (data && !(data instanceof FormData) && !headers["Content-Type"]) {
      xhr.setRequestHeader("Content-Type", "application/json");
    }
  };

  /** links XHR events to the Promise resolution/rejection */
  private _attachRequestListeners = <T>(
    xhr: XMLHttpRequest,
    resolve: (value: T) => void,
    reject: (reason: unknown) => void,
  ): void => {
    /* catching the response */
    xhr.onload = () => {
      /* 200 >= xhr.status < 300 */
      if (
        xhr.status >= HttpStatus.Ok &&
        xhr.status < HttpStatus.MultipleChoices
      ) {
        resolve(xhr.response as T);
      } else {
        reject({
          status: xhr.status,
          reason: xhr.response?.reason || xhr.statusText,
          response: xhr.response,
        });
      }
    };

    /* catching failures */
    xhr.onabort = () =>
      reject({ status: 0, reason: "Request aborted", response: null });
    xhr.onerror = () =>
      reject({ status: 0, reason: "Network error", response: null });
    xhr.ontimeout = () =>
      reject({ code: 408, reason: "Request Timeout", response: null });
  };

  /** serializes data and executes the request */
  private _send = (xhr: XMLHttpRequest, options: HttpOptions): void => {
    const { method, data } = options;

    try {
      /* if no body */
      if (method === HttpMethod.GET || !data) {
        /* execute req */
        xhr.send();
      } else {
        /* if !FormData -> string */
        const body = data instanceof FormData ? data : JSON.stringify(data);
        /* execute req; Content-Type -> 'multipart/form-data' */
        xhr.send(body);
      }
    } catch (e) {
      const err = e as ErrorOptions;
      globalBus.emit("toast", {
        msg: "HTTPTransport: xhr.send failed.",
        type: "error",
      });
      throw new Error("HTTPTransport: xhr.send failed", { cause: err });
    }
  };
}
