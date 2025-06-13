import * as yup from 'yup';
import dayjs from 'dayjs';
const validYear = dayjs().subtract(18, 'year').year();
export const spcialChar = ['@', '!', '.', ','];
let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
let numbersFormat = /[0123456789]+/;
let capitalAlbhabet = /[A-Z]+/;
let smallAlbhabet = /[a-z]+/;

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email('Email must be a valid email')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

export const verifyEmailSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email('Email must be a valid email')
      .required('Email is required'),
  })
  .required();

export const resetPasswordEmail = yup
  .object({
    email: yup
      .string()
      .trim()
      .email('Email must be a valid email')
      .required('Email is required'),
  })
  .required();

export const VerifyUserSchema = yup.object({
  userId: yup
    .string()
    .trim()
    .min(5, 'Mininum 5 characters are required.')
    .max(5, 'User id must not exceed 5 characters.'),
});

export const changePasswordSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email('Email must be a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(
        8,
        'Password must be 8 characters long, with 1 upper case, 1 lower case and 1 special character',
      )
      .max(30, 'Maximum length of password must not exceed 30 characters')
      .test('special char', 'Password must contain Special character', (val) =>
        val ? format.test(val) : false,
      )
      .test('One Numeric', 'Password must contain 1 numeric value.', (val) =>
        val ? numbersFormat.test(val) : false,
      )
      .test(
        'One Capital',
        'Password must contain 1 capital letter word.',
        (val) => (val ? capitalAlbhabet.test(val) : false),
      )
      .test('One Small', 'Password must contain 1 small letter word.', (val) =>
        val ? smallAlbhabet.test(val) : false,
      ),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  })
  .required();

export const SignupSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Email must be a valid email')
    .required('Email is required')
    .max(50, 'Too long email address'),
  firstName: yup
    .string()
    .trim()
    .test(
      'special char',
      'First name must not contain special character.',
      (val) => (val ? !format.test(val) : true),
    )
    .test('One Numeric', 'First name must not contain numeric value.', (val) =>
      val ? !numbersFormat.test(val) : true,
    )
    .required('First name is required')
    .max(40, 'Too long first name'),
  lastName: yup
    .string()
    .trim()
    .test(
      'special char',
      'Last name must not contain special character.',
      (val) => (val ? !format.test(val) : true),
    )
    .test('One Numeric', 'Last name must not contain numeric value.', (val) =>
      val ? !numbersFormat.test(val) : true,
    )
    .required('Last name is required')
    .max(40, 'Too long last name'),
  phone: yup
    .number()
    .required('Phone number is required')
    .typeError('Phone number is required.')
    .test('len', 'Phone number is required.', (val) =>
      val ? val.toString().length > 1 : false,
    )
    .test('len', 'Minimum 10 characters required', (val) =>
      val ? val.toString().length > 9 : false,
    )
    .test('len', 'Maximum 10 characters required', (val) =>
      val ? val.toString().length < 11 : false,
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(
      8,
      'Password must be 8 characters long, with 1 upper case, 1 lower case and 1 special character',
    )
    .max(30, 'Maximum length of password must not exceed 30 characters')
    .test('special char', 'Password must contain Special character', (val) =>
      val ? format.test(val) : false,
    )
    .test('One Numeric', 'Password must contain 1 numeric value.', (val) =>
      val ? numbersFormat.test(val) : false,
    )
    .test(
      'One Capital',
      'Password must contain 1 capital letter word.',
      (val) => (val ? capitalAlbhabet.test(val) : false),
    )
    .test('One Small', 'Password must contain 1 small letter word.', (val) =>
      val ? smallAlbhabet.test(val) : false,
    ),

  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  gender: yup.string().required('Gender is required').nullable(),
  DOB: yup
    .string()
    .required('Date of brith is Required')
    .test(
      'low range',
      'Seems like you have entered wrong date of birth.',
      (val) => (val ? new Date(val).getFullYear() > 1800 : false),
    )
    .test('future date', 'Date of birth can not be in future', (val) =>
      val ? new Date(val).getFullYear() <= new Date().getFullYear() : false,
    )
    .test('len', 'User must be 18 years old', (val) =>
      val ? new Date(val).getFullYear() <= validYear : false,
    ),
});

export const UpdateProfileSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .test(
      'special char',
      'First name must not contain special character.',
      (val) => (val ? !format.test(val) : true),
    )
    .test('One Numeric', 'First name must not contain numeric value.', (val) =>
      val ? !numbersFormat.test(val) : true,
    )
    .required('First name is required')
    .max(40, 'Too long first name'),
  lastName: yup
    .string()
    .trim()
    .test(
      'special char',
      'Last name must not contain special character.',
      (val) => (val ? !format.test(val) : true),
    )
    .test('One Numeric', 'Last name must not contain numeric value.', (val) =>
      val ? !numbersFormat.test(val) : true,
    )
    .required('Last name is required')
    .max(40, 'Too long last name'),
  phone: yup
    .number()
    // .required('Phone number is required')
    .typeError('Phone number is required.')
    .nullable()
    .test('len', 'Phone number is required.', (val) =>
      val ? val.toString().length > 0 : false,
    )
    .test('len', 'Minimum 10 characters required', (val) =>
      val ? val.toString().length > 9 : false,
    )
    .test('len', 'Maximum 10 characters required', (val) =>
      val ? val.toString().length < 11 : false,
    ),
  gender: yup.string().required('Gender is required').nullable(),
  designation: yup
    .string()
    .trim()
    .test('One Numeric', 'Designation must not contain numeric value.', (val) =>
      val ? !numbersFormat.test(val) : true,
    )
    .required('Designation is required')
    .max(40, 'Max 40 characters can be added.'),
});

export const attendanceGenerateSchema = yup
  .object({
    year: yup.string().required('Please select a Year.'),
    month: yup.string().required('Please select a Month.'),
  })
  .required();

export const attendanceGenerateAdminSchema = yup.object({
  user: yup.object().required('Please select a user').nullable(),
  month: yup.string().required('Please select a month').nullable(),
  year: yup.string().required('Please select a Year.'),
});

export const adminPayslilpSchema = yup
  .object({
    user: yup.object().required('Please select a user').nullable(),
    year: yup.string().required('Please select a Year.'),
  })
  .required();

export const UserPayslilpSchema = yup
  .object({
    year: yup.string().required('Please select a Year.'),
  })
  .required();

export const editPayslipSchema = yup
  .object({
    user: yup.object().required('Please select a user').nullable(),
  })
  .required();
