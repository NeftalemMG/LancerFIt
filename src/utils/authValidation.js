import { FACULTY_OPTIONS, NATIONALITY_OPTIONS } from '../data/authOptions';

export function validateSignUp(values) {
  const errors = {};

  const firstName = values.firstName?.trim() || '';
  const lastName = values.lastName?.trim() || '';
  const email = values.email?.trim() || '';
  const password = values.password || '';
  const confirmPassword = values.confirmPassword || '';
  const faculty = values.faculty || '';
  const nationality = values.nationality || '';

  if (firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters.';
  }

  if (lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!FACULTY_OPTIONS.some((option) => option.value === faculty)) {
    errors.faculty = 'Select a valid faculty.';
  }

  if (!NATIONALITY_OPTIONS.some((option) => option.value === nationality)) {
    errors.nationality = 'Select a valid nationality.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: {
      firstName,
      lastName,
      email,
      password,
      faculty,
      nationality,
    },
  };
}

export function validateForgotPassword(values) {
  const errors = {};
  const email = values.email?.trim() || '';

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: { email },
  };
}

export function validateSignIn(values) {
  const errors = {};

  const email = values.email?.trim() || '';
  const password = values.password || '';

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: {
      email,
      password,
    },
  };
}

