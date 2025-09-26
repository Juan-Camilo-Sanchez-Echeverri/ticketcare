export interface PayloadToken {
  /**
   * This variable contains the user's id.
   *
   * @member {string} sub - the user's id.
   */
  sub: string;

  /**
   * This variable contains the user's role.
   *
   * @member {string} role - the user's role.
   */
  roles?: string[];
}
