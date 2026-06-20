import { useMutation } from "@tanstack/react-query";

interface RegisterParams {
  email: string;
  fullName: string;
  companyName: string;
  password: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: async ({ email, fullName, companyName, password }: RegisterParams) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      
      const response = await fetch(`${backendUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          companyName,
        }),
      });

      if (!response.ok) {
        const errDetails = await response.json().catch(() => ({ message: "Backend registration failed." }));
        throw new Error(errDetails.message || "Failed to sign up with workspace server");
      }

      return response.json();
    },
  });
}

