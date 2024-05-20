import * as yup from "yup";

type ValidationResult<T> = { error?: string, values?: T }

export const yupValidate = async <T extends object>(schema: yup.Schema, values: T): Promise<ValidationResult<T>> => {
    try {
        const data = await schema.validate(values);
        return { values: data }
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return { error: error.message }
        } else {

            return { error: (error as any).massage };
        }
    }

}

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

yup.addMethod(yup.string, "email", function validateEmail(message) {
    return this.matches(emailRegex, {
        message,
        name: "email",
        excludeEmptyString: true,
    });
});

export const newUserSchema = yup.object({
    name: yup.string().required("Name is missing"),
    email: yup.string().email("Invalid email").required("Email is missing"),
    password: yup
        .string()
        .required("Password is missing")
        .min(8, "Password should be at least 8 characters long")
        .matches(
            passwordRegex,
            "Password should contain at least 1 small letter, one capital letter, and one alphanumeric character"
        ),
});

export const userSignInSchema = yup.object({
    email: yup.string().email("Please enter a valid email").required("Email is missing"),
    password: yup
        .string()
        .required("Password is missing")
    // .min(8, "Password should be at least 8 characters long")
    // .matches(
    //     passwordRegex,
    //     "Password should contain at least 1 small letter, one capital letter, and one alphanumeric character"
    // ),
});

export const forgetPasswordSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is missing"),
})