interface FilterBarProps {
    activeFilter: boolean | null;
    onFilterChange: (isActive: boolean | null) => void;
    searchTerm: string;
    onSearch: (term: string) => void;
  }
  
  const FilterBar = ({ activeFilter, onFilterChange, searchTerm, onSearch }: FilterBarProps) => {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold mb-2">Filtrar por estado</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => onFilterChange(null)}
                className={`px-4 py-2 rounded-md transition ${
                  activeFilter === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => onFilterChange(true)}
                className={`px-4 py-2 rounded-md transition ${
                  activeFilter === true
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => onFilterChange(false)}
                className={`px-4 py-2 rounded-md transition ${
                  activeFilter === false
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Históricos
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="block text-lg font-semibold mb-2">
              Buscar paciente
            </label>
            <input
              type="text"
              id="search"
              placeholder="Nombre del paciente..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default FilterBar;