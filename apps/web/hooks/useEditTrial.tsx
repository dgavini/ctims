import getConfig from "next/config";
import axios from "axios";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import useRefreshToken from "./useRefreshToken";

const useEditTrial = () => {
  const { refreshTokenOperation } = useRefreshToken();

  const { publicRuntimeConfig } = getConfig();
  axios.defaults.baseURL = publicRuntimeConfig.REACT_APP_API_URL || "http://localhost:3333/api"

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {data, status} = useSession()

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.push('/');
    }
  }, [status])

  const editTrialOperation = async (trialId: string) => {
    console.log('editTrialOperation trialId', trialId)
    const accessToken = localStorage.getItem('ctims-accessToken');
    const headers = {
      'Authorization': 'Bearer ' + accessToken,
    }

    try {
      const response = await axios.request({
        method: 'get',
        url: `/trials/${trialId}`,
        headers,
      });
      const trial: any = response.data;
      setResponse(trial);
    }
    catch (error) {
      console.log('response', error.response)
      if(error.response) {
        setError(error.response.data);
      } else {
        setError(error.message);
      }
    }
    finally {
      setLoading(false);
      refreshTokenOperation();
    }
  }

  return {response, error, loading, editTrialOperation};

}
export default useEditTrial;
