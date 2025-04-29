'use client';

const Error404 = () => {

  return (
    <>
        <div className="flex flex-col items-center justify-center text-center relative absolute top-0 left-0 w-full h-full mt-10">
            <h1 className="text-5xl mt-10 font-bold">Página no encontrada</h1>
        </div>
    </>
  );
}

export default function Main() {
  return <Error404 />;
}