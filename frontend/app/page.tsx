'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface APIReponse {
  message: string;
  status: string;
}

export default function Home() {
  const [data, setData] = useState<APIReponse | null>(null);

  useEffect(() => {
    axios.get("http:/localhost:8000/app_user/prueba/") 
      .then(response => {
        setData(response.data); // Axios already parses JSON automatically
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div>Bienvenido al frontend de fisiofind, listo para pelarte con nextjs?</div>
      <h1> Además estas usando el fondo del componente que nos hemos descargado</h1>
      <BackgroundBeams />
      {data && (
        <div>
          <p>Message: {data.message}</p>
          <p>Status: {data.status}</p>
        </div>
      )}
    </>
  );
}
