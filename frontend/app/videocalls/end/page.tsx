import RatingForm from '@/components/ui/RatingForm';
import React from 'react';

const EndCallPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <h1 className='text-4xl font-extrabold mb-40 absolute top-32'>Cita finalizada</h1>
            <RatingForm/>
        </div>
    );
};

export default EndCallPage;