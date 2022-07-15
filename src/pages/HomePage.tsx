import React, { useEffect, useState } from 'react';
import RepoCard from '../components/RepoCard';
import { useDebounce } from '../hooks/debounce';
import { useLazyGetUserReposQuery, useSearchUsersQuery } from '../store/github/github.api';

const HomePage = () => {
    const [search, setSearch] = useState('');
    const [dropdown, setDropdown] = useState(false);
    const debounced = useDebounce(search);
    const {isError, isLoading, data: users} = useSearchUsersQuery(debounced, {
        skip: debounced.length < 3,
        refetchOnFocus: true,
    });

    const [fetchRepos, { isError: areReposError, isLoading: areReposLoading, data: repos }] = useLazyGetUserReposQuery()

    useEffect(() => {
        if(debounced.trim().length > 3 && users?.length! > 0) setDropdown(true);
        else setDropdown(false);
        
    }, [debounced, users]);

    const clickHandler = (username: string) => {
        fetchRepos(username);
        setDropdown(false);
    }

    return (
        <div className='flex justify-center pt-10 mx-auto h-screen w-screen'>
            {isError && <h2 className='text-center text-red-600'>Something went wrong...</h2>}

            <div className='relative w-[560px]'>
                <input 
                    className='border py-2 px-4 w-full h-[42px] mb-2'
                    type="text" 
                    placeholder='Search for GitHub user...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {dropdown && <ul className='list-none absolute top-[42px] left-0 right-0 max-h-[200px] overflow-y-scroll shadow-md bg-white'>                 
                {isLoading && <h2 className='text-center'>Loading...</h2>}
                    { users?.map(user => (
                        <li 
                            className='py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer'
                            key={user.id}
                            onClick={() => clickHandler(user.login)}
                        >{ user.login }</li>
                    )) }
                </ul>}
                <div className='container'>
                    {areReposLoading && <h2 className='text-center'>Loading repositories...</h2>}
                    {repos?.map(repo => <RepoCard key={repo.id} repo={repo}/>)}
                </div>
            </div>
        </div>
    );
};

export default HomePage;