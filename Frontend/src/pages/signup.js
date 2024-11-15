import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button'; // Adjust the path as necessary
import { Input } from '@/components/ui/input'; // Adjust the path as necessary
import { Label } from '@/components/ui/label'; // Adjust the path as necessary

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const router = useRouter();

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            await signUp({
                username: email,
                password,
                attributes: {
                    email,
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Sign Up Successful',
                text: 'Please check your email for the verification code.',
            });
            setShowVerification(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Sign Up Failed',
                text: error.message,
            });
        }
    };

    const handleVerify = async (event) => {
        event.preventDefault();
        try {
            await confirmSignUp(email, verificationCode);
            Swal.fire({
                icon: 'success',
                title: 'Verification Successful',
                text: 'Your account has been verified. Redirecting to login...',
            });
            setTimeout(() => {
                router.push('/login'); // Redirect to login
            }, 2000);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: error.message,
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-2xl rounded-2xl">
                {showVerification ? (
                    <form onSubmit={handleVerify} className="space-y-6">
                        <h2 className="text-3xl font-extrabold text-center text-gray-900">Verify Your Account</h2>
                        <div>
                            <Label htmlFor="verificationCode">Verification Code</Label>
                            <Input
                                type="text"
                                id="verificationCode"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">Verify</Button>
                    </form>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-6">
                        <h2 className="text-3xl font-extrabold text-center text-gray-900">Sign Up</h2>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" variant="default" size="default" className="w-full">Sign Up</Button>
                        <div className="text-sm text-center">
                            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Already have an account? Log in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
