"use client";

import { useUserContext } from "@/context/globalProvider";
import axios from "axios";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function AdminCreate() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    emailId: "",
    phone: "",
    pondName: "",
    pondAddress: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const { userInfo } = useUserContext();

  if(userInfo?.role !== "SUPERADMIN") return redirect("/");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/v1/user/admin/create`,
        formData,
        { withCredentials: true }
      );

      if (!response.data.success) throw new Error(response.data.message);

      setFormData({
          username: "",
          password: "",
          emailId: "",
          phone: "",
          pondName: "",
          pondAddress: "",
        });
        alert("Admin has been successfully created!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create admin");
    }
  };

  return (
    <div className="m-auto w-[90%] sm:w-3/4 md:w-1/2">
      <h1 className="text-center text-4xl font-bold text-black dark:text-white">
        Create Admin
      </h1>
      <form onSubmit={handleCreateAdmin}>
        <div className="p-6.5">
          {[
            "username",
            "password",
            "emailId",
            "phone",
            "pondName",
            "pondAddress",
          ].map((field) => (
            <div className="mb-4.5" key={field}>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                {field !== 'emailId' && <span className="text-meta-1">*</span>}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                placeholder={`Enter your ${field}`}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          ))}

          <button
            type="submit"
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Create Admin
          </button>
        </div>
        {error && <p className="text-center text-danger">{error}</p>}
        {success && <p className="text-center text-success">{success}</p>}
      </form>
    </div>
  );
}
