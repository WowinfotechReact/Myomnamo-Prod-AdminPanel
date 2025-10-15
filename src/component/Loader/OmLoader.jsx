import React from 'react';
import OmImage from '../../assets/images/OmLoader.png'; // Replace with actual image path
import './OmLoader.css'
const OmLoader = () => {
    const LoaderWrapper = styled('div')(({ theme }) => ({
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2001,
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2)
        }
    }));
    return (
        <LoaderWrapper>
            <div className="flex items-center justify-center h-screen bg-white">
                <img
                    src={OmImage}
                    alt="Om Symbol"
                    className="w-32 h-32 animate-pulse-custom"
                />
            </div>
        </LoaderWrapper>

    );
};

export default OmLoader;
