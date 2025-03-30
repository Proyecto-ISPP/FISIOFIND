'use client'

interface RestrictedAccessProps {
  message: string;
}

const RestrictedAccess = ({ message }: RestrictedAccessProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full transition-all duration-300"
           style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        <h2 className="text-2xl font-bold mb-4"
            style={{ 
              background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
          Acceso restringido
        </h2>
        <p className="text-gray-700 mb-6">
          🔒 {message}
        </p>
        <button
          onClick={() => (window.location.href = '/login')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 w-full"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default RestrictedAccess;