import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import db from '../../config/prismadb';
import { userType } from '../../shared/type';

declare module 'express' {
  interface Request {
    validData?: userType;
  }
}

// Constants for validation rules
const VALIDATION_RULES = {
  NAME_PATTERN: /^[A-Za-z ]+$/,
  USERNAME_PATTERN: /^[a-zA-Z0-9_]*$/,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 16,
} as const;

// Error messages
const ERROR_MESSAGES = {
  NAME_REQUIRED: 'Name cannot be empty',
  NAME_INVALID: 'Enter a valid name (letters and spaces only)',
  USERNAME_REQUIRED: 'Username cannot be empty',
  USERNAME_MIN: `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters`,
  USERNAME_MAX: `Username cannot exceed ${VALIDATION_RULES.USERNAME_MAX_LENGTH} characters`,
  USERNAME_PATTERN: 'Username can only contain letters, numbers, and underscores',
  USERNAME_TAKEN: 'Username already registered',
  EMAIL_REQUIRED: 'Email cannot be empty',
  EMAIL_INVALID: 'Enter a valid email',
  EMAIL_TAKEN: 'Email already registered',
  PASSWORD_REQUIRED: 'Password cannot be empty',
  PASSWORD_MIN: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_MAX: `Password cannot exceed ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`,
} as const;

const signupSchema = yup.object().shape({
  name: yup
    .string()
    .transform((value) => {
      if (!value) return value;
      return value
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    })
    .trim()
    .required(ERROR_MESSAGES.NAME_REQUIRED)
    .test('isPerfectString', ERROR_MESSAGES.NAME_INVALID, 
      (value) => !value || VALIDATION_RULES.NAME_PATTERN.test(value)),

  username: yup
    .string()
    .trim()
    .required(ERROR_MESSAGES.USERNAME_REQUIRED)
    .min(VALIDATION_RULES.USERNAME_MIN_LENGTH, ERROR_MESSAGES.USERNAME_MIN)
    .max(VALIDATION_RULES.USERNAME_MAX_LENGTH, ERROR_MESSAGES.USERNAME_MAX)
    .matches(VALIDATION_RULES.USERNAME_PATTERN, ERROR_MESSAGES.USERNAME_PATTERN)
    .lowercase(), // Convert to lowercase to ensure case-insensitive uniqueness

  email: yup
    .string()
    .trim()
    .required(ERROR_MESSAGES.EMAIL_REQUIRED)
    .email(ERROR_MESSAGES.EMAIL_INVALID)
    .lowercase(), // Convert to lowercase to ensure case-insensitive uniqueness

  password: yup
    .string()
    .trim()
    .required(ERROR_MESSAGES.PASSWORD_REQUIRED)
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, ERROR_MESSAGES.PASSWORD_MIN)
    .max(VALIDATION_RULES.PASSWORD_MAX_LENGTH, ERROR_MESSAGES.PASSWORD_MAX),
});

const signupValidation = async (req: Request, res: Response, next: NextFunction) => {
  const validationErrors: { [key: string]: string[] } = {};
  const { name, username, email, password } = req.body;

  try {
    // Sanitize inputs before validation
    const sanitizedData = {
      name: name?.trim(),
      username: username?.trim().toLowerCase(),
      email: email?.trim().toLowerCase(),
      password: password?.trim(),
    };

    // Check if email and username are already registered
    const [existingUser, existingUsername] = await Promise.all([
      db.user.findFirst({ 
        where: { 
          email: sanitizedData.email 
        },
        select: { email: true } // Only select needed field
      }),
      db.user.findFirst({ 
        where: { 
          username: sanitizedData.username 
        },
        select: { username: true } // Only select needed field
      }),
    ]);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: { email: [ERROR_MESSAGES.EMAIL_TAKEN] },
      });
    }

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: { username: [ERROR_MESSAGES.USERNAME_TAKEN] },
      });
    }

    // Validate input fields
    const validatedData = await signupSchema.validate(sanitizedData, {
      stripUnknown: true,
      abortEarly: false,
    });

    req.validData = validatedData as userType;
    return next();

  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach((error: yup.ValidationError) => {
        if (!error.path) return;
        
        validationErrors[error.path] = validationErrors[error.path] || [];
        validationErrors[error.path].push(error.message);
      });

      return res.status(400).json({
        success: false,
        message: validationErrors,
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: { general: ['An unexpected error occurred during validation'] },
    });
  }
};

export default signupValidation;