import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginValidation } from "../../utils/validations";
import { gql, useMutation, ApolloError } from "@apollo/client";
import { toast } from "react-toastify";
import logo from "../../assets/images/logo.png";
import styles from "./LoginPage.module.css";
import { useAuth } from "../../context/AuthContext";

const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

type FormData = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(loginValidation),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await login({
        variables: {
          loginInput: {
            email: data.email,
            password: data.password,
          },
        },
      });

      if (response.data?.login) {
        authLogin(response.data.login.accessToken, response.data.login.user);
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      // Type guard for Apollo errors
      const apolloError = err as ApolloError;
      const errorMessage =
        apolloError.graphQLErrors?.[0]?.message ||
        apolloError.networkError?.message ||
        "Something went wrong during login";
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>
              <img src={logo} alt="logo" className={styles.booksIcon} />
            </span>
            <span>E-Pharmacy</span>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.tagline}>
            <h1>
              Your medication, delivered
              <div className={styles.pillImage}></div> Say goodbye to all{" "}
              <span className={styles.highlight}>your healthcare</span> worries
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
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? "Processing..." : "Log in"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.decorativeElements}></div>
    </div>
  );
};

export default LoginPage;
