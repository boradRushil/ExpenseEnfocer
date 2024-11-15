import '@/styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from 'aws-amplify/auth';
import amplifyConfig from '@/amplifyConfig';
import { Amplify } from 'aws-amplify';

Amplify.configure(amplifyConfig);

function App({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                await getCurrentUser();
            } catch {
                if (router.pathname !== '/login' && router.pathname !== '/signup' && router.pathname !== '/forgot-password') {
                    router.push('/login');
                }
            }
        };

        checkUser();

    }, [router]);

    return <Component {...pageProps} />;
}

export default App;
