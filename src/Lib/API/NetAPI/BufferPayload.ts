import { Dictionary } from "Lib/Objects/Dictionary";

export class BufferPayload {
  payload: Blob;
  name: string;

  extraFields: Dictionary<string, string>;

  constructor(payload: Blob, name: string) {
    this.payload = payload;
    this.name = name;

    this.extraFields = new Dictionary<string, string>();
  }

  WithExtraField(field: string, data: string): BufferPayload {
    this.extraFields.setValue(field, data);
    return this;
  }
}
