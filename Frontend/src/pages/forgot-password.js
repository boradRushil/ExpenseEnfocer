import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState("requestCode"); // 'requestCode' or 'resetPassword'
    const router = useRouter();

    const handleRequestVerificationCode = async (event) => {
        event.preventDefault();
        try {
            const output = await resetPassword({ username: email });
            handleResetPasswordNextSteps(output);
        } catch (error) {
            console.log("Error requesting verification code", error);
        }
    };

    const handleResetPasswordNextSteps = (output) => {
        const { nextStep } = output;
        switch (nextStep.resetPasswordStep) {
            case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
                const codeDeliveryDetails = nextStep.codeDeliveryDetails;
                console.log(`Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`);
                setStep("resetPassword");
                break;
            case 'DONE':
                console.log('Successfully reset password.');
                break;
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            await confirmResetPassword({
                username: email,
                confirmationCode: verificationCode,
                newPassword
            });
            await router.push("/login"); // Redirect to login
        } catch (error) {
            console.log("Error resetting password", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
                {step === "requestCode" ? (
                    <form onSubmit={handleRequestVerificationCode}>
                        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
                        <div className="mt-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 mt-2 border rounded-md"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Request Reset
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
                        <div className="mt-4">
                            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                id="verificationCode"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full p-2 mt-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 mt-2 border rounded-md"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
