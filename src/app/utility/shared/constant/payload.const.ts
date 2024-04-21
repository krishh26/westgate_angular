export const Payload = {

    getSubscriptionList: {
        device_type: "Web"
    },

    otpVerification: {
        email: '',
        otp: '',
        device_type: 'Web'
    },

    resendOTP: {
        email: '',
        device_type: 'Web'
    },

    employeeList: {
        search_text: '',
        page_number: '1',
        user_type: '',
        page_size: '10',
        device_type: 'Web'
    },

    searchemployeeList: {
        search_text: '',
        page_number: '1',
        user_type: '',
        page_size: '10',
        employee_type: '',
        device_type: 'Web',
        project_id : ''
    },

    projectlist: {
        search_text: '',
        page_number: '1',
        page_size: '10',
        status : ''
    },


   projectmanagelist: {
        search_text: '',
        page_number: '1',
        page_size: '10',
    },

    allemployeeList: {
        search_text: '',
        page_number: '1',
        user_type: '',
        employee_type: '',
        page_size: '10',
        device_type: 'Web',
        project_id : ''
    },

    addTeaminProject: {
        project_id : '',
        employee_id : ''

    }
}