import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ------------------ Yup Validation Schema ------------------
const schema = yup.object().shape({
  name: yup.string().required("Full Name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().required("Email is required").email("Invalid email address"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      // Call API signup
      await signup(data);
      navigate("/verify-notice?email=" + data.email);
    } catch (errors) {
      if (errors.general) {
        // network or general error
        setError("general", {
          type: "server",
          message: errors.general[0],
        });
      } else {
      // Laravel validation errors (object)
        Object.keys(errors).forEach((key) => {
          setError(key, {
            type: "server",
            message: errors[key], // display all the errors
          });
        });
      }
    }
  };

  return (
    <AuthLayout>
      {errors.general && (
        <p className="text-red-500 text-sm mb-2">{errors.general.message}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form space-y-5">

        {/* Hidden field - all signups are hosts by default */}
        <input type="hidden" {...register("role")} value="host" />

        {/* Form Inputs */}
        <Input register={register("name")} placeholder="Full Name" error={errors.name} />
        <Input register={register("email")} placeholder="Email Address" error={errors.email} />
        <Input type="password" register={register("password")} placeholder="Password" error={errors.password} />
        <Input type="password" register={register("password_confirmation")} placeholder="Confirm Password" error={errors.password_confirmation} />

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-semibold">
            Login
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}

function Input({ type = "text", placeholder, register, error }) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full px-5 py-3 rounded-full border focus:ring-2 focus:outline-none transition
          ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-orange-400"}`}
      />
      {error && Array.isArray(error.message) && error.message.map((msg, idx) => (
        <p key={idx} className="text-red-500 text-sm mt-1">{msg}</p>
      ))}
    </div>
  );
}
