import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

interface LoginParams {
  email: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginParams) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
