export class UpdatePasswordPayload {
  password: string;
  key: PasswordPayloadKey;

  constructor(password: string, key: PasswordPayloadKey) {
    this.password = password
    this.key = key
  }
}

export class PasswordPayloadKey {
  content: string;
  iv: string;

  constructor(privKey: string, iv: string) {
    this.content = privKey
    this.iv = iv
  }
}
