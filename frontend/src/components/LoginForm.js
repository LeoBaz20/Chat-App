import { useState } from "react";
import { setToken } from '../utils/auth';
import { useRouter } from 'next/navigation'
import { Typography, Input, Button, Alert } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useWebSocket } from "@/services/WebSocketService";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { authenticate } = useWebSocket();

  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3002/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Error en el inicio de sesión');
      }

      const data = await response.json();
      setToken(data.token);  // Guardar el token en localStorage
      authenticate(data.token);  // Autenticar con WebSocket
      router.push("/home");

    } catch (error) {
      setError("Tu correo o contraseña están incorrectos.");
    }
  };


  return (
    <section className="grid items-center h-screen p-8 text-center"
    style={{
      background: "linear-gradient(180deg, #1B2838, #152a3e)", // Degradado de colores
    }}>
<div className="bg-white rounded-lg p-8 mx-auto max-w-[24rem]">
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Iniciar Sesión
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Ingrese su correo y contraseña para iniciar sesión
        </Typography>
        <form onSubmit={handleSubmit} className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="block mb-2 font-bold text-gray-900"
              >
                Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 placeholder:opacity-100"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="block mb-2 font-bold text-gray-900"
              >
                Contraseña
              </Typography>
            </label>
            <Input
              id="password"
              size="lg"
              placeholder="********"
              labelProps={{
                className: "hidden",
              }}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 placeholder:opacity-100"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </i>
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <Alert color="red">
              {error}
            </Alert>
          )}
          <Button color="gray" size="lg" className="mt-6" fullWidth type="Submit"
          >
            Iniciar Sesión
          </Button>
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
          >
            Sin Registro?{" "}
            <a href="/register" className="font-medium text-gray-900">
              Registrarse
            </a>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default LoginForm;