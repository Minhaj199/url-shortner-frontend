import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const url = import.meta.env.VITE_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email !== "") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValid = emailRegex.test(formData.email);
      if (!isValid) {
        setErrors((el) => ({ ...el, email: "Not Valid Email" }));
        return;
      } else {
        setErrors((el) => ({ ...el, email: "" }));
      }
    }

    if (formData.password !== "") {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      const isStrong = strongPasswordRegex.test(formData.password);
      if (!isStrong) {
        setErrors((el) => ({
          ...el,
          password: "Add upper,lower,number,symbol and more than 8 letters",
        }));
        return;
      } else {
        setErrors((el) => ({ ...el, password: "" }));
      }
    }

    if (!isLogin) {
      if (formData.name.trim() === "") {
        setErrors((el) => ({ ...el, name: "blank not alowed" }));
        return;
      } else {
        setErrors((el) => ({ ...el, name: "" }));
      }
      if (
        (formData.name.trim() !== "" && formData.name.length < 3) ||
        formData.name.length > 15
      ) {
        setErrors((el) => ({ ...el, name: "Add name between 3-15" }));
        return;
      } else {
        setErrors((el) => ({ ...el, name: "" }));
      }
    }

    console.log("Form submitted:", formData);
    if (isLogin) {
      try {
        const response = await axios.post(`${url}/api/login`, formData);

        if (response.data) {
          const datas = response.data as { token: string };
          if (datas?.token && typeof datas.token === "string") {
            console.log(datas.token);
            localStorage.setItem("token", datas.token);
            console.log(localStorage.getItem("token"));
            navigate("/home");
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response && axiosError.response.data) {
          setErrors((prev) => ({
            ...prev,
            password: axiosError.response?.data.message || "server error",
          }));
        } else if (error instanceof Error) {
          setErrors((prev) => ({
            ...prev,
            password: axiosError.response?.data.message || "server error",
          }));
        }
        console.log(error);
      }
    } else {
      try {
        const response = (await axios.post(`${url}/api/register`, formData))
          ?.data;
        console.log(response);
        if (response) {
          const data = response as { token: string };
          if (data?.token && typeof data.token === "string") {
            localStorage.setItem("token", data.token);
            navigate("/home");
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response && axiosError.response.data) {
          setErrors((prev) => ({
            ...prev,
            password: axiosError.response?.data.message || "server error",
          }));
        } else if (error instanceof Error) {
          setErrors((prev) => ({
            ...prev,
            password: axiosError.response?.data.message || "server error",
          }));
        }
        console.log(error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const FieldError = ({ message }: { message: string }) => {
    if (!message) return null;
    return (
      <Alert variant="destructive" className="py-2 mt-1 ">
        <AlertDescription className="text-sm font-semibold ml-2">
          {message}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? "Login" : "Sign Up"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User size={20} />
                    Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    max={15}
                    onChange={handleInputChange}
                    className="w-full"
                    required={!isLogin}
                  />
                  <FieldError message={errors.name} />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail size={20} />
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
                <FieldError message={errors.email} />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock size={20} />
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
                <FieldError message={errors.password} />
              </div>

              <Button type="submit" className="w-full mt-6">
                {isLogin ? "Login" : "Sign Up"}
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-500 hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Login"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AuthForms;
