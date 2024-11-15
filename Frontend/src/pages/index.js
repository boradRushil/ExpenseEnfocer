import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-teal-400 min-h-screen flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center shadow-md rounded-lg p-8">
                Welcome to the Expense Enforcer!
            </h1>

            <div className="text-center"> {/* Added a div for centering */}
                <Link href="/signup">
                    <button className="bg-white text-blue-500 hover:text-blue-700 hover:bg-blue-100 font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-200">
                        Go to Sign Up/Login
                    </button>
                </Link>
            </div>
        </div>
    );
}
