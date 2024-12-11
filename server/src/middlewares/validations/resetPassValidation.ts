import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';
import { InferType } from 'yup';

// Define the type for login data
type ResetPasswordData = yup.InferType<typeof resetPassSchema>;
// Define the type for reset password data
// interface ResetPasswordData {
//   password: string;
//   token: string;
// }

declare module 'express' {
  interface Request {
    resetPass?: ResetPasswordData;
  }
}

// Constants for validation rules
const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 16,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
} as const;

// Error messages
const ERROR_MESSAGES = {
  PASSWORD_REQUIRED: 'Password cannot be empty',
  PASSWORD_MIN: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_MAX: `Password cannot exceed ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`,
  PASSWORD_PATTERN: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  TOKEN_REQUIRED: 'We encountered an issue with the password reset link. Please request a new one.',
  TOKEN_INVALID: 'Invalid or expired password reset link. Please request a new one.',
  UNEXPECTED_ERROR: 'An unexpected error occurred during validation',
} as const;

const resetPassSchema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .required(ERROR_MESSAGES.PASSWORD_REQUIRED)
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, ERROR_MESSAGES.PASSWORD_MIN)
    .max(VALIDATION_RULES.PASSWORD_MAX_LENGTH, ERROR_MESSAGES.PASSWORD_MAX)
    .matches(VALIDATION_RULES.PASSWORD_PATTERN, ERROR_MESSAGES.PASSWORD_PATTERN),
  
  token: yup
    .string()
    .trim()
    .required(ERROR_MESSAGES.TOKEN_REQUIRED)
    .test('isValidToken', ERROR_MESSAGES.TOKEN_INVALID, 
      (value) => value ? value.length >= 32 : false), // Basic token length validation
});

/**
 * Middleware to validate password reset requests
 * Validates the password strength and reset token
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns void | Response with validation errors
 */
const resetPassValidation = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void | Response> => {
  const validationErrors: Record<string, string[]> = {};
  const { token, password } = req.body;

  try {
    // Sanitize inputs
    const sanitizedData = {
      password: password?.trim(),
      token: token?.trim(),
    };

    // Validate input fields
    const validatedData = await resetPassSchema.validate(
      sanitizedData,
      { 
        stripUnknown: true, 
        abortEarly: false,
      }
    );

    // Set validated data to request object
    req.resetPass = validatedData;
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

export default resetPassValidation;