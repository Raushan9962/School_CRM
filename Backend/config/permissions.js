module.exports = {
    "Super Admin": {
        // Super Admin manages schools, super-level finances, etc., not specific school modules
        _all: ["View", "Create", "Edit", "Delete"]
    },
    "School Admin": {
        // School Admin can do everything within their school
        _all: ["View", "Create", "Edit", "Delete"]
    },
    "Principal": {
        "Student Management": ["View", "Create", "Edit", "Delete"],
        "Teacher Management": ["View", "Create", "Edit", "Delete"],
        "Parent Management": ["View", "Create", "Edit", "Delete"],
        "Timetable & Schedule": ["View", "Create", "Edit", "Delete"],
        "Fee & Accounts": ["View", "Create", "Edit", "Delete"],
        "Reports & Analytics": ["View", "Create", "Edit"],
        "System Settings": ["View", "Create", "Edit", "Delete"],
        "Exam & Results": ["View", "Create", "Edit", "Delete"]
    },
    "Teacher": {
        "My Students": ["View", "Edit"],
        "Attendance": ["View", "Create", "Edit"],
        "Marks & Results": ["View", "Create", "Edit"],
        "Assignments": ["View", "Create", "Edit", "Delete"],
        "Timetable": ["View"],
        "Communication (Parents)": ["View", "Create"],
        "Leave & Attendance": ["View", "Create"],
        "Study Material": ["View", "Create", "Edit", "Delete"]
    },
    "Student": {
        "My Profile": ["View", "Edit"], // limited edit
        "Attendance": ["View"],
        "Results & Marks": ["View"],
        "Assignments": ["View", "Submit"],
        "Timetable": ["View"],
        "Fee Details": ["View"],
        "Notices & Events": ["View"],
        "Library": ["View", "Book Request"]
    },
    "Parent": {
        "Child Profile": ["View"],
        "Attendance": ["View"],
        "Results & Performance": ["View"],
        "Fee Payment": ["View", "Online Pay"],
        "Timetable & Events": ["View"],
        "Communication": ["View", "Create"],
        "Notifications": ["View"]
    },
    "Accountant": {
        "Fee Management": ["View", "Create", "Edit", "Delete"],
        "Student Fee Records": ["View", "Create", "Edit"],
        "Salary & Payroll": ["View", "Create", "Edit"],
        "Expenses & Budget": ["View", "Create", "Edit", "Delete"],
        "Financial Reports": ["View", "Create"],
        "Staff Records": ["View"] // limited
    },
    "Librarian": {
        "Book Catalog": ["View", "Create", "Edit", "Delete"],
        "Issue & Return": ["View", "Create", "Edit"],
        "Fine Management": ["View", "Create", "Edit"],
        "Library Reports": ["View", "Create"],
        "Member Records": ["View", "Edit"],
        "Inventory": ["View", "Create", "Edit"]
    },
    "Transport Manager": {
        "Vehicle Management": ["View", "Create", "Edit", "Delete"],
        "Route Management": ["View", "Create", "Edit", "Delete"],
        "Driver & Staff": ["View", "Create", "Edit", "Delete"],
        "Student Transport": ["View", "Create", "Edit"],
        "Tracking & Alerts": ["View", "Create"],
        "Transport Reports": ["View", "Create"]
    },
    "Receptionist": {
        "Admission Enquiry": ["View", "Create", "Edit"],
        "Student Records": ["View"], // basic
        "Visitor Management": ["View", "Create", "Edit", "Delete"],
        "Call Log": ["View", "Create", "Edit"],
        "Complaints & Requests": ["View", "Create", "Edit"],
        "Appointments": ["View", "Create", "Edit", "Delete"],
        "Notices & Circulars": ["View"]
    }
};
