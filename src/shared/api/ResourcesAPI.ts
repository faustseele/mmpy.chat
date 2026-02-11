import HTTPTransport from "./http/HTTPTransport.ts";
import { BaseAPI } from "./model/BaseAPI.ts";
import { ChatMessageFile } from "./model/api.types.ts";

const resourcesAPIInstance = new HTTPTransport("/resources");

class ResourcesAPI extends BaseAPI {
  public upload(file: File): Promise<ChatMessageFile> {
    const form = new FormData();
    form.append("resource", file);

    return resourcesAPIInstance.post("", {
      data: form,
    }) as Promise<ChatMessageFile>;
  }

  public getResourcePath(path: string): string {
    return `https://ya-praktikum.tech/api/v2/resources${path}`;
  }
}

export default new ResourcesAPI();
