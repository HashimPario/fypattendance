# Smart Attendance System - DEV

#### Brief concept:

Smart Attendance System is aimed to provide full control over staff activity in the company.
We provides two way benefits, one is Staff can manage his accounts details + he can also generate his payslip, attendance record and much more; where Admin will be the facilitator of staff by means of updating / verifying / blocking staff, submit their payroll, update their profile and other similar actions,

### Features in this application:

###### We have two users:

1- Admin
2- Staff

#### ADMIN:

Dashboard:

- Admin can check currently present and absent staff.
- Admin can see current month activity.

Manage Users:

- Admin can manage users (i.e verify, block, update profile).
  - Note: While verifying user admin will assign employee id of staff.

Reports:

- Attendance Report:

  - Admin can generate attendance report of all (Verified / Authorized) staff of one Month.

- Payslip Report:

  - Admin can generate payslip report of all (Verified / Authorized) staff of any one year.

- Leave Report:
  - Admin can see total day present / absent of any staff for any year along with leave balance.
    - Note: Inorder to see this report, staff must have checked in for any month in selected year.

Payroll:

- Manage Payroll:

  - Admin can pay salary of current month from this section.
    - Note: Admin can send salary one by one or select all and pay salary.
    - Note: Salary can't be paid if it is already paid for current month or the selected staff salary is not saved.

- Edit Payroll:
  - Admin can generate any staff payslip templete and update it's content

#### STAFF:

Dashboard:

- Staff can checkin, checkout, breakin and breakout.

Reports:

- Attendance Report:
  - Staff can generate any month attendance report.
- Payslip Report:
  - Staff can generate any month payslip report.
- Leave Report:
  - Staff can see present / absent / leave status of any year.
    - Note: Inorder to see this report, staff must have checked in for any month in selected year.

#### Available Scripts

### `npm install or yarn`

To install project dependencies

### `npm start or yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build or yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
