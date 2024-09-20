
export interface ICredentialAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires: Date;
  created: Date;
  scope: string;
  user_id: number;
  refresh_token: string;
  public_key: string;
  live_mode: boolean;
}

export class CredentialAccessToken implements ICredentialAccessToken {
  access_token: string = '';
  token_type: string = '';
  expires_in: number = 0;
  expires: Date;
  scope: string = '';
  user_id: number = 0;
  refresh_token: string = '';
  public_key: string = '';
  live_mode: boolean = false;
  created: Date;

  constructor() {
    this.created = new Date();
    this.expires = new Date(this.created.getTime() + this.expires_in);
  }

  expired(): boolean {
    const expires = new Date(this.created.getTime() + this.expires_in);
    return expires < new Date();
  }
}

