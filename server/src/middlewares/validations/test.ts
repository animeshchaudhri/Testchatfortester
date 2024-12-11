import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';
import db from '../../config/prismadb';

declare module 'express-serve-static-core' {
  interface Request {
    updateProfileData?: {
      name?: string;
      username?: string;
      email?: string;
      password?: string;
      // add other fields you allow for update
    };
  }
}

const updateProfileSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .matches(/^[A-Za-z ]+$/, 'Name can only contain letters and spaces')
    .optional(),
  username: yup
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username can not exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email')
    .optional(),
  password: yup
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be no more than 16 characters')
    .optional(),
});

const updateProfileValidation = async (req: Request, res: Response, next: NextFunction) => {
  const validationErrors: { [key: string]: string[] } = {};
  const { name, username, email, password } = req.body;
  const userId = req.userSession.id; // Assuming req.userSession contains user data with an 'id' property
 
  try {
    // Check if email or username already exists (if being updated)
    if (email) {
      const existingEmailUser = await db.user.findFirst({ where: { email } });
      if (existingEmailUser && existingEmailUser.id !== userId) {
        validationErrors['email'] = ['Email is already registered'];
      }
    }

    if (username) {
      const existingUsernameUser = await db.user.findFirst({ where: { username } });
      if (existingUsernameUser && existingUsernameUser.id !== userId) {
        validationErrors['username'] = ['Username is already taken'];
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors,
      });
    }

    // Validate input fields
    const validatedData = await updateProfileSchema.validate(
      { name, username, email, password },
      { stripUnknown: true, abortEarly: false },
    );

    // Set validated data to the request object
    req.updateProfileData = validatedData as typeof req.updateProfileData;
    next();
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach((error) => {
        const fieldName = error.path || '';
        if (!validationErrors[fieldName]) {
          validationErrors[fieldName] = [];
        }
        validationErrors[fieldName].push(error.message);
      });
      return res.status(400).json({
        success: false,
        message: validationErrors,
      });
    }
    next(err);
  }
};

export default updateProfileValidation;