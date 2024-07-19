"use client"

import LoginForm from '@/components/LoginForm';
import { getToken } from '@/utils/auth';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';


const LoginPage = () => {
const token = getToken();

  useEffect(()=>{
    if (token){
      redirect("/");
    }
  })

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
