/**
 * Class for storing a RSA keypair in memory
 */
export class RSAMemoryKeypair {
  readonly PrivateKey: string;
  readonly PublicKey: string;

  /**
   * @param priv RSA Private key stored in PEM format
   * @param pub RSA Public Key stored in PEM format
   */
  constructor(priv: string, pub: string) {
    this.PrivateKey = priv;
    this.PublicKey = pub;
  }
}
