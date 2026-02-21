export interface MeroShareCanUserApplyResponse {
  message: string;
  status: string;
  statusCode: number;
}

export interface MeroShareApplyPayload {
  accountBranchId: number;
  accountNumber: string;
  accountTypeId: number;
  appliedKitta: string;
  bankId: string;
  boid: string;
  companyShareId: string;
  crnNumber: string;
  customerId: number;
  demat: string;
  transactionPIN: string;
}

export interface MeroShareApplyResponse {
  message: string;
  status: string;
  statusCode: number;
}
