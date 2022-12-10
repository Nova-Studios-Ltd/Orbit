export class ResetPasswordPayload {
  password: string;
  key: ResetPasswordPayloadKey;

  constructor(password: string, key: ResetPasswordPayloadKey) {
    this.password = password
    this.key = key
  }
}

export class ResetPasswordPayloadKey {
  priv: string;
  iv: string;
  pub: string;

  constructor(privKey: string, iv: string, pub: string) {
    this.priv = privKey;
    this.iv = iv;
    this.pub = pub;
  }
}
