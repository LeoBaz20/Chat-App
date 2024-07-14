"use client"

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import SideBar from '@/components/SideBar';


const Home = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 p-4">
                {/* Resto del contenido de tu aplicación */}
            </div>
        </div>
    );
};

export default Home;
