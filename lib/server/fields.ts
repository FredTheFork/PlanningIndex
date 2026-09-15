// Server-owned fields (id, userId, timestamps, tracking state) are never in
// these lists — write routes copy only these keys from request bodies, so a
// client can never take over another user's record or forge lifecycle data.

export const LEAD_EDITABLE_FIELDS = [
  'propertyAddress',
  'propertyPostcode',
  'contactName',
  'contactPhone',
  'contactEmail',
  'status',
  'notes',
  'nextFollowUp',
  'nextFollowUpType',
  'estimatedValue',
  'lat',
  'lng',
] as const;

// Creation additionally accepts the linked planning application identity —
// a lead's application link is fixed once created and can't be PATCHed.
export const LEAD_CREATABLE_FIELDS = [
  'applicationId',
  'applicationReference',
  'applicationTitle',
  ...LEAD_EDITABLE_FIELDS,
] as const;

export const PROPOSAL_EDITABLE_FIELDS = [
  'status',
  'projectTitle',
  'projectReference',
  'recipientName',
  'recipientAddress',
  'recipientPostcode',
  'propertyAddress',
  'propertyPostcode',
  'applicationId',
  'applicationReference',
  'applicationTitle',
  'contactName',
  'contactPhone',
  'contactEmail',
  'companyName',
  'companyAddress',
  'companyPhone',
  'companyEmail',
  'companyVatNumber',
  'templateId',
  'sections',
  'totalValue',
] as const;

// Creation additionally accepts identity fields the client generates
// (reference, template, lead link); everything else is set by the server.
export const PROPOSAL_CREATABLE_FIELDS = [
  'reference',
  'leadId',
  'createdDate',
  ...PROPOSAL_EDITABLE_FIELDS,
] as const;
