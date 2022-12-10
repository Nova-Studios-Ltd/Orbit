export class RegisterPayload {
  username: string;
  password: string;
  email: string;
  key: RegPayloadKey

  constructor(username: string, password: string, email: string, key: RegPayloadKey) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.key = key;
  }
}

export class RegPayloadKey {
  priv: string;
  privIV: string;
  pub: string;

  constructor(priv: string, privIV: string, pub: string) {
    this.priv = priv;
    this.privIV = privIV;
    this.pub = pub;
  }
}
