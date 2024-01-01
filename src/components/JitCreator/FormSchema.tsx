import * as z from "zod";
import { type PropsWithChildren } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

const FormSchema = z
  .object({
    move: z.object({ name: z.string(), id: z.string() }).optional(),
    position: z
      .object({
        name: z.string(),
        id: z.string(),
        categoryType: z.object({ name: z.string() }),
      })
      .optional(),
  })
  .refine((data) => data.move ?? data.position, {
    message: "Select at least one move or one position.",
    path: ["move"],
  });

export const useJitCreatorForm = () => {
  return useFormContext<FormData>();
};

export const JitCreatorFormProvider: React.FC<
  Required<PropsWithChildren<unknown>>
> = (props) => {
  const methods = useForm<FormData>({ resolver: zodResolver(FormSchema) });
  return <FormProvider {...methods} {...props} />;
};

export type FormData = z.infer<typeof FormSchema>;
