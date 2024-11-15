import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {Button} from "@/components/ui/button";// Adjust the import path as necessary

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignIn = async (event) => {
        event.preventDefault();
        try {
            const req = {username: email, password};
            await signIn(req);
            router.push("/manage-expenses");
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-2xl rounded-2xl">
                <form onSubmit={handleSignIn} className="space-y-6">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900">Sign In</h2>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="text-sm text-right">
                        <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                        </Link>
                    </div>
                    <div>
                        <Button type="submit" variant="default" size="default" className="w-full">
                            Sign In
                        </Button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <span>Don't have an account? </span>
                    <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
