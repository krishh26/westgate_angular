export const Payload = {

  projectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: "",
    status: "",
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    expired: false,
    supplierStatus: ""
  },

  dataByStatus : {
    endDate : '',
    startDate : ''
  },

  pmAllProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: "",
    status: "",
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    supplierId: '', 
    expired: false,
    selectedSupplier : false
  },

  pmShortlistsupplierProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: "",
    status: "",
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    supplierId: '',
    selectedSupplier: false
  },

  pmMatchProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: "",
    status: "",
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    supplierId: '',
    expired:false
  },

  pmCloseProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: "",
    status: "",
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
  },

  pmShortlistProjectList: {
    keyword: '',
    page: '1',
    limit: '10',
    applied: false,
    sortlist: false,
    match: "",
    status: "",
    category: '',
    industry: '',
    projectType: '',
    clientType: '',
    publishDateRange: '',
    SubmissionDueDateRange: '',
    valueRange: '',
    supplierId: '',
    expired: false
  },

  mailSSList: {
    keyword: '',
    page: '1',
    limit: '10',
  },

  casestudyList : {
    page: '1',
    limit: '10',
    userId : ''
  },

  
  supplierUserList : {
    page: '1',
    limit: '10',
  },

  manageSUpplierUserList : {
    page: '1',
    limit: '10',
    userId : ''
  },

  Project: {
    _id: "",
    projectName: "",
    description: "",
    category: "",
    industry: "",
    value: Number,
    projectType: "",
    status: "",
    dueDate: Date,
    // Add other properties as needed
  }

}
