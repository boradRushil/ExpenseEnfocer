import { useState, useEffect } from 'react';
import ExpenseTracker from '@/components/trackExpenses/ExpenseTracker';
import {getCurrentUser} from "aws-amplify/auth";

const ManageExpenses = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = getCurrentUser();
                console.log(user);
                setUser(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (typeof window !== 'undefined') {
            fetchUser();
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return <ExpenseTracker user={user} />;
};

export default ManageExpenses;
