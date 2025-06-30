"use client";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // method jo data lega aur ek api p set krega
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      console.log(data);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const router = useRouter();
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder='Passowrd'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
 
        <input
          type="password"
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="button">Register</button>
      </form>
      <div>
        <p>Already have an account ? <a href="/login"></a></p>
      </div>
    </div>
  );
}

export default RegisterPage;
