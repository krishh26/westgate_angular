export const Payload = {
  projectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: '',
    status: '',
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    expired: false,
    supplierStatus: '',
    appointed: '',
    myList: '',
    bidManagerStatus: '',
    notAppointed: ''
  },

  dataByStatus: {
    endDate: '',
    startDate: '',
  },

  pmAllProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: '',
    status: '',
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    supplierId: '',
    expired: false,
    selectedSupplier: false,
    bidManagerStatus: ''
  },

  pmShortlistsupplierProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: '',
    status: '',
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    supplierId: '',
    selectedSupplier: false,
    bidManagerStatus: ''
  },

  pmMatchProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: '',
    status: '',
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    supplierId: '',
    expired: false,
    bidManagerStatus: ''
  },

  pmCloseProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: '',
    status: '',
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    bidManagerStatus: ''
  },

  pmShortlistProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: '',
    status: '',
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    supplierId: '',
    expired: false,
     bidManagerStatus: ''
  },

  mailSSList: {
    keyword: '',
    page: '1',
    limit: '10',
  },

  casestudyList: {
    page: '1',
    limit: '10',
    userId: '',
  },

  supplierUserList: {
    page: '1',
    limit: '10',
  },

  manageSUpplierUserList: {
    page: '1',
    limit: '10',
    userId: '',
  },

  Project: {
    _id: '',
    projectName: '',
    description: '',
    category: '',
    industry: '',
    value: Number,
    projectType: '',
    status: '',
    dueDate: Date,
    // Add other properties as needed
  },
};

export function createPayloadCopy(): any {
  return JSON.parse(JSON.stringify(Payload));
}
