import { ContentType } from "Lib/API/NetAPI/ContentType";
import { Dictionary, Indexable } from "Lib/Objects/Dictionary";

export class HeaderCollection implements Indexable<string, string> {
  [x: string]: string;
}

export class NetHeaders {
  private headers: Dictionary<string, string>;

  constructor() {
    this.headers = new Dictionary<string, string>();
  }

  WithAuthorization(key: string) : NetHeaders {
    this.headers.setValue("Authorization", key);
    return this;
  }

  WithContentType(type: ContentType) : NetHeaders {
    this.headers.setValue("Content-Type", type);
    return this;
  }

  WithCustom(key: string, value: string) : NetHeaders {
    this.headers.setValue(key, value);
    return this;
  }

  Finish() : HeaderCollection {
    return this.headers._dict as HeaderCollection;
  }
}
