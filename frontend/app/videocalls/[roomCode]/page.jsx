'use client';

import { use } from 'react';
import Room from '../Room';  

export default function RoomPage({ params }) {
  const { roomCode } = use(params);

  return <Room roomCode={roomCode} />;
}
