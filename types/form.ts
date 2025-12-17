import { z } from "zod";
import { loginSchema, signUpSchema } from "@/app/auth/schema";

export type SignUpFormData = z.infer<typeof signUpSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;
