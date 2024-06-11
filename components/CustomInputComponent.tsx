"use client";

import React from "react";
import { Control, FieldPath } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { authFormSchema } from "@/lib/utils";

const formSchema = authFormSchema("sign-up");
interface CustomInputComponent {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label?: string;
  placeholder?: string;
  type?: string;
}

const CustomInputComponent = ({ control, name, label, placeholder, type }: CustomInputComponent) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <div className="form-item">
            <FormLabel className="form-label">{label}</FormLabel>
            <div className="flex w-full flex-col">
              <FormControl>
                <Input
                  id={name}
                  placeholder={placeholder}
                  className="input-class"
                  {...(type && { type: type })}
                  {...field}
                ></Input>
              </FormControl>
              {/* <FormMessage className="form-message mt-2"></FormMessage> */}
            </div>
          </div>
        </>
      )}
    />
  );
};

export default CustomInputComponent;
