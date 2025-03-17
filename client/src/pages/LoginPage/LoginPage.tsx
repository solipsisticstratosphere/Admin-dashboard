import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginValidation } from "../../utils/validations";
import styles from "./LoginPage.module.css";
type FormData = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(loginValidation),
    mode: "onBlur",
  });

  const loginUser = async (data: FormData): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (
        data.email === "admin@email.com" &&
        data.password === "admin@email.com"
      ) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const isSuccess = await loginUser(data);
      if (isSuccess) {
        navigate("/home");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💊</span>
            <span>E-Pharmacy</span>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.pillImage}></div>
          <div className={styles.tagline}>
            <h1>
              Your medication, delivered Say goodbye to all{" "}
              <span className={styles.highlight}>your healthcare worries</span>{" "}
              with us
            </h1>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Email address"
                {...register("email")}
                className={errors.email ? styles.inputError : styles.input}
              />
              {errors.email && (
                <p className={styles.errorMessage}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className={errors.password ? styles.inputError : styles.input}
              />
              {errors.password && (
                <p className={styles.errorMessage}>{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <p className={styles.errorMessage}>{errors.root.message}</p>
            )}

            <div className={styles.formGroup}>
              <button
                type="submit"
                className={styles.loginButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Log in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
