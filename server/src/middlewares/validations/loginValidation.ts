import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';
import { InferType } from 'yup';

// Define the type for login data
type LoginData = yup.InferType<typeof loginSchema>;

declare module 'express' {
  interface Request {
    signUpData?: LoginData;
  }
}

// Constants for validation rules
const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 16,
  EMAIL_MAX_LENGTH: 255,
} as const;

// Error messages
const ERROR_MESSAGES = {
  EMAIL_REQUIRED: 'Email cannot be empty',
  EMAIL_INVALID: 'Enter a valid email',
  EMAIL_TOO_LONG: `Email cannot exceed ${VALIDATION_RULES.EMAIL_MAX_LENGTH} characters`,
  PASSWORD_REQUIRED: 'Password cannot be empty',
  PASSWORD_MIN: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_MAX: `Password cannot exceed ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`,
  UNEXPECTED_ERROR: 'An unexpected error occurred during validation',
} as const;

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required(ERROR_MESSAGES.EMAIL_REQUIRED)
    .email(ERROR_MESSAGES.EMAIL_INVALID)
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, ERROR_MESSAGES.EMAIL_TOO_LONG)
    .lowercase(), // Convert to lowercase for case-insensitive validation

  password: yup
    .string()
    .trim()
    .required(ERROR_MESSAGES.PASSWORD_REQUIRED)
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, ERROR_MESSAGES.PASSWORD_MIN)
    .max(VALIDATION_RULES.PASSWORD_MAX_LENGTH, ERROR_MESSAGES.PASSWORD_MAX),
});

/**
 * Middleware to validate login requests
 * Validates email format and password length
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns void | Response with validation errors
 */
const loginValidation = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void | Response> => {
  const validationErrors: Record<string, string[]> = {};
  const { email, password } = req.body;

  try {
    // Sanitize inputs
    const sanitizedData = {
      email: email?.trim().toLowerCase(),
      password: password?.trim(),
    };

    // Validate input fields
    const validatedData = await loginSchema.validate(
      sanitizedData,
      { 
        stripUnknown: true, 
        abortEarly: false,
      }
    );

    // Set validated data to request object
    req.signUpData = validatedData;
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
      message: { general: [ERROR_MESSAGES.UNEXPECTED_ERROR] },
    });
  }
};

export default loginValidation;