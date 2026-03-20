// Auth Constants - Shared constants for authentication features

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  CHANGE_PASSWORD: "/change-password",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  HOME: "/",
} as const

export const SOCIAL_PROVIDERS = {
  GITHUB: "github",
  GOOGLE: "google",
} as const

export type SocialProvider = typeof SOCIAL_PROVIDERS[keyof typeof SOCIAL_PROVIDERS]

export const SOCIAL_PROVIDER_LABELS: Record<SocialProvider, string> = {
  github: "GitHub",
  google: "Google",
}

export const SOCIAL_PROVIDER_ICONS: Record<SocialProvider, string> = {
  github: "/github.svg",
  google: "/google.svg",
}

export const FORM_MESSAGES = {
  // Validation messages
  REQUIRED: "This field is required",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Invalid email address",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  NAME_REQUIRED: "Name is required",
  NAME_MIN_LENGTH: "Name must be at least 2 characters",
  CONFIRM_PASSWORD_REQUIRED: "Please confirm your password",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",

  // Success messages
  LOGIN_SUCCESS: "Logged in successfully!",
  REGISTER_SUCCESS: "Account created successfully! Please verify your email.",
  SOCIAL_LOGIN_SUCCESS: (provider: SocialProvider) => `Logged in with ${SOCIAL_PROVIDER_LABELS[provider]}!`,
  SOCIAL_REGISTER_SUCCESS: (provider: SocialProvider) => `Signed up with ${SOCIAL_PROVIDER_LABELS[provider]}!`,
  CHANGE_PASSWORD_SUCCESS: "Password changed successfully!",
  RESET_PASSWORD_SUCCESS: "Password reset successfully!",
  PASSWORD_RESET_SENT: "Password reset link sent to your email!",

  // Error messages
  GENERIC_ERROR: "An error occurred. Please try again.",
  INVALID_TOKEN: "Invalid reset token",
  TOKEN_EXPIRED: "Reset link has expired or is invalid. Please request a new one.",

  // Button text
  LOGIN: "Sign in",
  REGISTER: "Create Account",
  CHANGE_PASSWORD: "Change Password",
  RESET_PASSWORD: "Reset Password",
  SEND_RESET_LINK: "Send Reset Link",
  SENDING: "Sending...",
  CREATING: "Creating...",
  CHANGING: "Changing...",
  RESETTING: "Resetting...",
  SIGN_IN_WITH: (provider: SocialProvider) => `Sign in with ${SOCIAL_PROVIDER_LABELS[provider]}`,
  SIGN_UP_WITH: (provider: SocialProvider) => `Sign up with ${SOCIAL_PROVIDER_LABELS[provider]}`,

  // Form placeholders
  EMAIL: "your.email@example.com",
  PASSWORD: "••••••••••",
  NAME: "John Doe",

  // Card titles and descriptions
  LOGIN_TITLE: "Welcome Back",
  LOGIN_DESCRIPTION: "Enter your credentials to access your account",
  REGISTER_TITLE: "Create Account",
  REGISTER_DESCRIPTION: "Enter your details to create a new account",
  CHANGE_PASSWORD_TITLE: "Change Password",
  CHANGE_PASSWORD_DESCRIPTION: "Enter your current password and choose a new one",
  RESET_PASSWORD_TITLE: "Reset Password",
  RESET_PASSWORD_DESCRIPTION: "Enter your new password below",
  FORGOT_PASSWORD_TITLE: "Forgot Password?",
  FORGOT_PASSWORD_DESCRIPTION: "Enter your email address and we'll send you a link to reset your password",

  // Link text
  BACK_TO_SIGN_IN: "Back to Sign in",
  ALREADY_HAVE_ACCOUNT: "Already have an account?",
  DONT_HAVE_ACCOUNT: "Don't have an account?",
  SIGN_IN: "Sign in",
  SIGN_UP: "Sign up",

  // Success page text
  CHECK_YOUR_EMAIL: "Check Your Email",
  WEVE_SENT_LINK: "We've sent a password reset link to",
  SEND_ANOTHER_LINK: "Send Another Link",
  INVALID_LINK: "Invalid Link",
  INVALID_LINK_DESCRIPTION: "This password reset link is invalid or has expired.",
  REQUEST_NEW_LINK: "Request New Link",

  // AutoComplete values
  AUTOCOMPLETE: {
    EMAIL: "email",
    CURRENT_PASSWORD: "current-password",
    NEW_PASSWORD: "new-password",
    NAME: "name",
  } as const,
} as const

export const INPUT_HEIGHT = "h-11"
export const BUTTON_HEIGHT = "h-11"
export const LOGO_SIZE = 80

export const CARD_CLASSES = "w-full max-w-2xl shadow-2xl border-slate-200 dark:border-slate-800"
export const BUTTON_PRIMARY_CLASSES = "w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200"
export const BUTTON_OUTLINE_CLASSES = "h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
export const INPUT_CLASSES = "h-11 transition-all duration-200"
export const CARD_HEADER_CLASSES = "space-y-4 text-center pb-6"
export const CARD_TITLE_CLASSES = "text-2xl font-bold sm:text-3xl"
export const CARD_DESCRIPTION_CLASSES = "text-base sm:text-lg"