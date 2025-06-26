import { LoginForm } from "@/components/LoginForm";
import { useAuthUser } from "@/customs/authentication/useAuthUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/ui/Spinner";

const Login = () => {
  const { isPending, isAuthenticated } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isPending) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, isPending]);

  if (isAuthenticated || isPending) return <Spinner height="100vh" />; // prevent flicker during redirect

  return <LoginForm />;
};

export default Login;
