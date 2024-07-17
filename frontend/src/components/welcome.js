import { Typography } from "@material-tailwind/react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { getUserFromToken } from "@/utils/auth";



export function Welcome() {
    const LoggedUser=getUserFromToken();

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-main">
            <ChatBubbleLeftRightIcon className="w-32 h-32 mb-4 text-white" />
            <Typography variant="h1" color="white" className="mb-2">
                {LoggedUser.name}, Bienvenido a Chat-App
            </Typography>
            <Typography variant="paragraph" color="white">
                Haga click en un usuario para iniciar un chat
            </Typography>
        </div>
    );
}

export default Welcome;
