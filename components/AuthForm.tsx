"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomInputComponent from "./CustomInputComponent";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      // firstName: "",
      // lastName: "",
      // address1: "",
      // postalCode: "",
      // birth: "",
      // ssn: "",
      // state: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);

    try {
      // signup with apwrite and create plaid token

      if (type === "sign-in") {
        const response = await signIn({
          email: values.email,
          password: values.password,
        });
        if (response) router.push("/");
      }

      if (type === "sign-up") {
        const newUser = await signUp(values);

        setUser(newUser);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center gap-1 flex">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="My Bank logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">My bank</h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign in" : "Sign up"}
            <p className="text-16 font-normal text-gray-600">
              {user ? "Link your account to get started" : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">plaid</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  {/* <div className="flex gap-4">
                    <CustomInputComponent
                      control={form.control}
                      name="firstName"
                      placeholder="Enter your first name"
                      label="First Name"
                    />
                    <CustomInputComponent
                      control={form.control}
                      name="lastName"
                      placeholder="Enter your last name"
                      label="Last Name"
                    />
                  </div>
                  <CustomInputComponent
                    control={form.control}
                    name="address1"
                    placeholder="Enter your address"
                    label="Address"
                  />
                  <CustomInputComponent control={form.control} name="city" placeholder="Enter your city" label="City" />
                  <div className="flex gap-4">
                    <CustomInputComponent control={form.control} name="state" placeholder="ex: NY" label="State" />
                    <CustomInputComponent
                      control={form.control}
                      name="postalCode"
                      placeholder="ex: 1101"
                      label="Postal Code"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInputComponent
                      control={form.control}
                      name="birth"
                      placeholder="yyyy-mm-dd"
                      label="Birth date"
                    />
                    <CustomInputComponent control={form.control} name="ssn" placeholder="Enter your SSN" label="SSN" />
                  </div> */}
                </>
              )}
              <CustomInputComponent
                control={form.control}
                name="email"
                placeholder="Enter your email"
                label="E-mail"
              ></CustomInputComponent>
              <CustomInputComponent
                control={form.control}
                name="password"
                placeholder="Enter your password"
                label="Password"
                type="password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin"></Loader2>
                    </>
                  ) : (
                    type.charAt(0).toUpperCase() + type.slice(1)
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in" ? "Don't have an account? " : "Already have an account?"}
            </p>
            <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"} className="form-link">
              {type === "sign-in" ? "Sign-up" : "Sign-in"}
            </Link>
          </footer>
        </>
      )}
    </div>
  );
};

export default AuthForm;
