export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailInputs {
  email: string;
}
export interface ResetPasswordEmail {
  email: string;
}

export interface VerifyUser {
  userId: string;
}

export interface SignupFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  gender: any;
  password: string;
  confirmPassword: number;
  DOB: string;
}

export interface UpdateProfileInputs {
  firstName: string;
  lastName: string;
  phone: number;
  gender: any;
  DOB: string;
  profilePicture: any;
  designation?:any
  fromTime?:any
  toTime?:any
}

export interface AttendanceGenerateInputs {
  year: string;
  month: string;
}

export interface AttendanceGenerateAdminInputs {
  user: Object;
  month: string;
  year: string;
}

export interface AdminPayslipInputs {
  user: Object;
  year: string;
}
export interface UserPayslipInputs {
  year: string;
}

export interface EditPayslipInputs {
  user: Object;
}
