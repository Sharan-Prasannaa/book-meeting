import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    await signup(data);
    navigate("/verify-notice?email=" + data.email);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <Input register={register("name")} placeholder="Full Name" error={errors.name} />
        <Input register={register("email")} placeholder="Email Address" error={errors.email} />
        <Input type="password" register={register("password")} placeholder="Password" error={errors.password} />
        <Input type="password" register={register("password_confirmation")} placeholder="Confirm Password" error={errors.password_confirmation} />

        <button
          type="submit"
          disabled={isSubmitting}
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
        className="w-full px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
