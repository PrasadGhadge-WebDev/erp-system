import React from "react";
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { register, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/default";
  const [formState, setFormState] = React.useState({
    company_name: "",
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register({
        company_name: formState.company_name,
        name: formState.name,
        email: formState.email,
        password: formState.password,
        phone: formState.phone,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create account");
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign up section */}
      <form
        onSubmit={onSubmit}
        className="mt-[6vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]"
      >
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Create Account
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your details to create your ERP account.
        </p>

        <InputField
          variant="auth"
          extra="mb-3"
          label="Company Name*"
          placeholder="Your company"
          id="company_name"
          type="text"
          name="company_name"
          value={formState.company_name}
          onChange={onChange}
          required
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="Full Name*"
          placeholder="Your name"
          id="name"
          type="text"
          name="name"
          value={formState.name}
          onChange={onChange}
          required
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="you@company.com"
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          value={formState.email}
          onChange={onChange}
          required
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="Phone"
          placeholder="Optional"
          id="phone"
          type="text"
          name="phone"
          value={formState.phone}
          onChange={onChange}
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={formState.password}
          onChange={onChange}
          required
        />

        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              I agree to the terms
            </p>
          </div>
        </div>

        {error ? <p className="mb-2 text-sm text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <Link
            to="/auth/sign-in"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
