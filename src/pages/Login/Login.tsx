import { LoginForm } from "../../components/ui/login-form";

const Login = () => {
  const handleLogin = (data: { email: string; password: string }) => {
    console.log("Login data:", data);
    // TODO: Implement login logic with API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Login Form with integrated logo */}
        <LoginForm onSubmit={handleLogin} />

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-8">
          <p>© 2025 Nedok. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
