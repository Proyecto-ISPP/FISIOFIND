"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

interface Physiotherapist {
  id: string;
  name: string;
  specializations: string;
  gender: string;
  rating: number;
  price: number;
  postalCode: string;
  image?: string;
}

const SearchPage = () => {
  const router = useRouter();
  const apiBaseurl = getApiBaseUrl();

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    specialization: "",
    schedule: "",
    maxPrice: "",
    postalCode: "",
    gender: "",
    name: "",
  });
  const [results, setResults] = useState<Physiotherapist[]>([]);
  const [suggested, setSuggested] = useState<Physiotherapist[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(`${apiBaseurl}/api/guest_session/specializations/`);
        if (response.status === 200 && response.data?.length) {
          setSpecializations(response.data);
        }
      } catch (error) {
        console.error("Error loading specializations:", error);
      }
    };

    fetchSpecializations();
  }, [apiBaseurl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setSearchAttempted(true);
    try {
      const response = await axios.post(`${apiBaseurl}/api/guest_session/advanced-search/`, filters);
      if (response.status === 200) {
        const { exactMatches, suggestedMatches } = response.data;
        setResults(exactMatches);
        setSuggested(suggestedMatches);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-[#EEFbFA]">
      <h1 className="text-4xl font-bold text-center text-[#253240] mb-6">
        Búsqueda avanzada de fisioterapeutas
      </h1>

      <section className="max-w-4xl mx-auto mb-8 bg-white shadow-md rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="specialization" value={filters.specialization} onChange={handleInputChange} className="border px-4 py-2 rounded-md">
            <option value="">Especialidad</option>
            {specializations.map((spec, i) => (
              <option key={i} value={spec}>{spec}</option>
            ))}
          </select>

          <select name="schedule" value={filters.schedule} onChange={handleInputChange} className="border px-4 py-2 rounded-md">
            <option value="">Preferencia horaria</option>
            <option value="mañana">Mañana (06:00 - 14:00)</option>
            <option value="tarde">Tarde (14:00 - 20:00)</option>
            <option value="noche">Noche (20:00 - 23:00)</option>
          </select>

          <input name="maxPrice" type="number" placeholder="Precio máximo (€)" value={filters.maxPrice} onChange={handleInputChange} className="border px-4 py-2 rounded-md" />

          <input name="postalCode" placeholder="Código Postal" value={filters.postalCode} onChange={handleInputChange} className="border px-4 py-2 rounded-md" />

          <select name="gender" value={filters.gender} onChange={handleInputChange} className="border px-4 py-2 rounded-md">
            <option value="">Género del profesional</option>
            <option value="male">Hombre</option>
            <option value="female">Mujer</option>
            <option value="indifferent">Me da igual</option>
          </select>

          <input name="name" placeholder="Nombre del fisioterapeuta" value={filters.name} onChange={handleInputChange} className="border px-4 py-2 rounded-md" />
        </div>

        <div className="flex justify-center mt-6">
          <button onClick={handleSearch} className="bg-[#1E5ACD] hover:bg-[#5ab3a8] text-white font-bold py-2 px-8 rounded-full transition-all">
            Buscar
          </button>
        </div>
      </section>

      {/* Resultados */}
      {searchAttempted && results.length === 0 && (
        <div className="text-center text-red-500 mb-6">
          No se encontraron resultados exactos para tu búsqueda. Aquí tienes algunas sugerencias:
        </div>
      )}

      <section className="max-w-6xl mx-auto overflow-x-auto">
        <div className="flex space-x-6 pb-4">
          {(results.length > 0 ? results : suggested).map((physio, i) => (
            <CardContainer key={i}>
              <CardBody className="w-72 bg-white border rounded-xl shadow-md p-4 flex flex-col justify-between">
                <CardItem className="text-lg font-bold text-[#253240]">{physio.name}</CardItem>
                <CardItem className="text-sm text-gray-500 mb-2">{physio.specializations}</CardItem>
                <Image src={physio.image || "/static/fisioterapeuta_sample.webp"} alt={physio.name} width={250} height={150} className="rounded-md object-cover" />
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => router.push(`/appointments/create/${physio.id}`)}
                    className="px-4 py-2 bg-[#1E5ACD] hover:bg-[#5ab3a8] text-white rounded-full text-sm"
                  >
                    Reservar cita
                  </button>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
