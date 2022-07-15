import React from 'react';
import { useSearchUsersQuery } from '../store/github/github.api';

const HomePage = () => {
    const {isError, isLoading, data} = useSearchUsersQuery('Vlad');

    console.log(data);
    return (
        <div>
            home
        </div>
    );
};

export default HomePage;