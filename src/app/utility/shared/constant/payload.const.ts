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
    },

    mailSSList: {
        keyword: '',
        page: '1',
        limit: '10',
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
