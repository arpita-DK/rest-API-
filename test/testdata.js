const testData = {
    validUserEmail: 'Brad@123',

    validCourseId: 'CIS 194',

    cartData: {
        email: 'Brad@123',
        cartid: ['CIS 194'],
        save: () => {
            return {
                status: 200,
                body: {
                    cartid: ['worked']
                }
            }
        }
    },
    courseDetails: [
        {
            id: 'CIS 194',
            title: 'Economics',
        },
    ],
    cartIdToRemove: 'CIS 194',
};

module.exports = { testData };
