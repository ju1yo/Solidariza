export default function Unauthorized() {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="p-8 bg-white shadow rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Acesso não autorizado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }
  