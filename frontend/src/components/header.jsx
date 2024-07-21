import { Navbar } from "@material-tailwind/react";
import { UserCircleIcon } from '@heroicons/react/24/solid';

export function Header() {
    return (
        <Navbar className="flex items-center px-4 py-2 mx-auto border rounded-none bg-main border-blue-gray-800 max-w-screen-3xl lg:px-8 lg:py-4">
            <UserCircleIcon className="w-8 h-8 mr-2 text-white" />
            <span className="text-lg text-white">Leonardo Bazurto</span>
        </Navbar>
    );
}

export default Header;
