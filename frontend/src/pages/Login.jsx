import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
          setErrorMessage(""); // clear previous error
          await login(data);
        } catch (error) {
          setErrorMessage(
            error.response?.data?.message || "Invalid credentials."
          );
        }
      };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form space-y-5">

        <Input register={register("email")} placeholder="Email Address" error={errors.email} />
        <Input type="password" register={register("password")} placeholder="Password" error={errors.password} />
        {errorMessage && (
            <p className="text-red-500 mt-2 text-sm">
                {errorMessage}
            </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-500 font-semibold">
            Sign Up
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
        className="w-full px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
