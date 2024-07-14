"use client"

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import LoginForm from '@/components/LoginForm';



const LoginPage = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
