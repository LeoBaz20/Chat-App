import { useState } from "react";
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";


export function RegisterForm() {
  const router = useRouter()
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    passwordMatch: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: formValues.name === '',
      email: formValues.email === '',
      password: formValues.password === '',
      confirmPassword: formValues.confirmPassword === '',
      passwordMatch: formValues.password !== formValues.confirmPassword,
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (!hasErrors) {
      try {
        const response = await fetch('http://localhost:3002/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });
  
        const data = await response.json();
        console.log(formValues);
        if (!response.ok) {
          throw new Error(data.error || 'Error al registrar el usuario');
        }
        toast.success("Usuario registrado correctamente");
        setTimeout(()=>{
          router.push("/");
        }, 2000);
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.message || 'Error al registrar el usuario');
      }
    } else {
      toast.error('Por favor, complete todos los campos correctamente.');
    }
  };


  return (
    <section className="grid items-center h-screen p-8 text-center"
    style={{
      background: "linear-gradient(180deg, #1B2838, #152a3e)", // Degradado de colores
    }}
    >
      <div className="bg-white rounded-lg p-10 mx-auto max-w-[24rem]">

        <Typography variant="h3" color="blue-gray" className="mb-2">
          Registro
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Ingrese sus detalles para el registro.
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name">
              <Typography
                variant="small"
                className="block mb-2 font-bold text-gray-900"
              >
                Nombre
              </Typography>
            </label>
            <Input
              id="name"
              color="gray"
              size="lg"
              type="text"
              name="name"
              placeholder="Juan"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 placeholder:opacity-100"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={formValues.name}
              onChange={handleChange}
              error={errors.name}
            />
            {errors.name && (
              <Typography color="red" variant="small">Este campo es obligatorio.</Typography>
            )}
          </div>
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
              value={formValues.email}
              onChange={handleChange}
              error={errors.email}
            />
            {errors.email && (
              <Typography color="red" variant="small">Este campo es obligatorio.</Typography>
            )}
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
              size="lg"
              placeholder="********"
              labelProps={{
                className: "hidden",
              }}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 placeholder:opacity-100"
              type={passwordShown ? "text" : "password"}
              name="password"
              value={formValues.password}
              onChange={handleChange}
              error={errors.password}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </i>
              }
            />
            {errors.password && (
              <Typography color="red" variant="small">Este campo es obligatorio.</Typography>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword">
              <Typography
                variant="small"
                className="block mb-2 font-bold text-gray-900"
              >
                Confirmar Contraseña
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              labelProps={{
                className: "hidden",
              }}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 placeholder:opacity-100"
              type={passwordShown ? "text" : "password"}
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword || errors.passwordMatch}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </i>
              }
            />
            {errors.confirmPassword && (
              <Typography color="red" variant="small">Este campo es obligatorio.</Typography>
            )}
            {errors.passwordMatch && (
              <Typography color="red" variant="small">Las contraseñas no coinciden.</Typography>
            )}
          </div>
          <Button color="gray" size="lg" className="mt-6" fullWidth type="submit">
            Registrarse
          </Button>
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
          >
            ¿Ya tienes una cuenta?{" "}
            <a href="/" className="font-medium text-gray-900">
              Iniciar Sesión
            </a>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default RegisterForm;