"use client"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from '@/components/RegisterForm';


const RegisterPage = () => {
  return (
    <div>
      <ToastContainer/>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;