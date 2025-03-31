import { useState } from 'react';
import useAxios from "./useAxios";

const useGetAgents = () => {
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { operation } = useAxios();

  const searchAgents = async (query) => {
    try {
      setLoading(true);
      const response = await operation(
        {
          method: 'get',
          url: `agents/agentdrug?query=${query}`
        }
        );
      const symbols = response.data;
      setFilteredAgents(symbols);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data);
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    filteredHugoSymbols: filteredAgents,
    error,
    loading,
    searchSymbols: searchAgents,
  };
};

export default useGetAgents;
