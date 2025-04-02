import RatingForm from '@/components/ui/RatingForm';
import React from 'react';

const EndCallPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <h1>Cita finalizada</h1>
            <RatingForm appointmentId={1}/>
        </div>
    );
};

export default EndCallPage;