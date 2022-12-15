import { FormikConfig, FormikErrors, useFormik, useFormikContext } from "formik";
import { useCallback } from "react";

export type FormDataBase = Record<string, any>;

export type UseFormReturn<TData extends FormDataBase> = Omit<
  ReturnType<typeof useFormik<TData>>,
  "setFieldValue"
> & {
  setFieldValue: <TfieldName extends keyof TData>(
    field: TfieldName,
    value: TData[TfieldName],
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<TData>> | Promise<void>;
};

export const useForm = <TData extends FormDataBase>(
  formProps: FormikConfig<TData>
): UseFormReturn<TData> => {
  const form = useFormik<TData>(formProps);
  const { dirty, handleSubmit: handleFormikSubmit } = form;

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      // we do it here because formik doesn't pass props like dirty to onSubmit :(
      if (dirty) {
        handleFormikSubmit(e);
      }
    },
    [dirty, handleFormikSubmit]
  );

  //@ts-ignore beause keyof Record<string, any> is not string
  return { ...form, handleSubmit };
};

export const useFormContext = useFormikContext;