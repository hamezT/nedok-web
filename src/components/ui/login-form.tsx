import * as React from "react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Logo } from "./logo";
import { LoadingScreen } from "./loading-screen";
import { login } from "../../services/authService";
import { setCookie, clearLocalStorageAuthData } from "../../utils/cookieUtils";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  isLoading?: boolean;
}

const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(
  ({ onSubmit, isLoading = false, ...props }, ref) => {
    const [formData, setFormData] = React.useState({
      email: "",
      password: "",
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState("");
    const [warning, setWarning] = React.useState("");
    const [isRedirecting, setIsRedirecting] = React.useState(false);

    // Helper function to trim only leading/trailing whitespace
    const trimInput = (value: string) => {
      return value.replace(/^\s+|\s+$/g, '');
    };

    // Helper function to check for extra whitespace
    const hasLeadingTrailingSpaces = (value: string) => {
      return /^\s|\s$/.test(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setWarning("");
      setIsSubmitting(true);

      // Check for extra whitespace before submit
      const emailHasSpaces = hasLeadingTrailingSpaces(formData.email);
      const passwordHasSpaces = hasLeadingTrailingSpaces(formData.password);

      if (emailHasSpaces || passwordHasSpaces) {
        const warningMessage = "Extra whitespace has been automatically removed.";
        setWarning(warningMessage);
      }

      // Trim only leading/trailing whitespace before submit to ensure
      const trimmedData = {
        email: trimInput(formData.email),
        password: trimInput(formData.password),
      };
      try {
        const response = await login(trimmedData.email, trimmedData.password);

        // Clear old localStorage auth data
        clearLocalStorageAuthData();

        // Store tokens in cookies
        // Access token expires in 1 hour (3600000 ms)
        const accessTokenExpiry = new Date(Date.now() + 3600000);
        setCookie('accessToken', response.token, {
          expires: accessTokenExpiry,
          path: '/',
          sameSite: 'Strict'
        });

        // Refresh token expires in 7 days (604800000 ms)
        const refreshTokenExpiry = new Date(Date.now() + 604800000);
        setCookie('refreshToken', response.refreshToken, {
          expires: refreshTokenExpiry,
          path: '/',
          sameSite: 'Strict'
        });
        // Call onSubmit if provided
        onSubmit?.(trimmedData);

        // Show loading screen before page transition
        setIsRedirecting(true);

        // Delay to let user see loading screen
        setTimeout(() => {
          // Navigate to home page
          // Use window.location to force a full page reload and ensure auth state is updated
          window.location.href = '/';
        }, 1500); // 1.5 second delay
      } catch (error: any) {
        console.error('Login failed:', error);
        setError(error.message || 'Login failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));

      // Check warning in real-time for current field
      const hasSpaces = hasLeadingTrailingSpaces(value);
      if (hasSpaces && value.length > 0) {
        setWarning(`Extra whitespace detected in ${name === 'email' ? 'email' : 'password'}. Will be removed during login.`);
      } else {
        // Clear warning only when both fields have no extra whitespace
        const otherField = name === 'email' ? formData.password : formData.email;
        if (!hasLeadingTrailingSpaces(otherField)) {
          setWarning("");
        }
      }
    };

    return (
      <>
        <Card className="w-full max-w-md mx-auto border border-gray-200 shadow-xl bg-white/98 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-2 relative">
          {/* Accent border top */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-[#E97132] to-[#92D050] rounded-full"></div>

          {/* Logo */}
          <div className="flex justify-center mb-4 pt-2">
            <Logo className="w-32 h-auto" width={128} height={51} />
          </div>

          <div className="w-16 h-1 bg-gradient-to-r from-[#E97132] to-[#92D050] mx-auto mb-4 rounded-full"></div>
          <CardTitle className="text-2xl font-bold text-center text-[#E97132]">
            Sign In
          </CardTitle>
          <CardDescription className="text-center text-[#92D050]">
            Enter your account information to continue
          </CardDescription>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              <div className="font-medium">Login Failed</div>
              <div className="mt-1">{error}</div>
            </div>
          )}

          {/* Warning Message */}
          {warning && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md text-sm">
              <div className="font-medium">Thông báo</div>
              <div className="mt-1">{warning}</div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={handleSubmit} className="space-y-4" {...props}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#E97132] font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email here"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="focus:ring-[#92D050] focus:border-[#92D050] border-gray-300 hover:border-[#E97132]/30 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#E97132] font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password here"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="focus:ring-[#92D050] focus:border-[#92D050] border-gray-300 hover:border-[#E97132]/30 transition-colors"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#E97132] to-[#92D050] hover:from-[#E97132]/90 hover:to-[#92D050]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button variant="link" className="text-sm text-[#E97132] hover:text-[#92D050]">
              Forgot password?
            </Button>
          </div>
        </CardContent>
        </Card>

        {/* Loading Screen */}
        {isRedirecting && (
          <LoadingScreen
            message="Login successful! Redirecting..."
          />
        )}
      </>
    );
  }
);

LoginForm.displayName = "LoginForm";

export { LoginForm };
