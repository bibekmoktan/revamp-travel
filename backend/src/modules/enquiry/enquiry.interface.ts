export type EnquiryStatus = 'new' | 'read' | 'replied';

export interface IEnquiry {
  name: string;
  email: string;
  phone?: string;
  message: string;
  packageId?: string;
  packageTitle?: string;
  status: EnquiryStatus;
}
