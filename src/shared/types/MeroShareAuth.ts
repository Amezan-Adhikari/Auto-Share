export interface MeroShareAuthPayload {
  clientId: number;
  password: string;
  username: string;
}

export interface MeroShareAuthResponse {
  statusCode: number;
  passwordPolicyChanged: boolean;
  passwordExpired: boolean;
  changePassword: boolean;
  accountExpired: boolean;
  dematExpired: boolean;
  message: string;
  isTransactionPINNotSetBefore: boolean;
  isTransactionPINReset: boolean;
}


export interface MeroShareExpiryMessage{
    expired:boolean;
    message:string;
}