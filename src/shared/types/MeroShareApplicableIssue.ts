export interface MeroShareApplicableIssue {
  companyShareId: number;
  subGroup: string;
  scrip: string;
  companyName: string;
  shareTypeName: string;
  shareGroupName: string;
  statusName: string;
  action: string;
  issueOpenDate: string;
  issueCloseDate: string;
}

export interface MeroShareApplicableIssueResponse {
  object: MeroShareApplicableIssue[];
  totalCount: number;
}
