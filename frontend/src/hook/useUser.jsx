import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useUser = (user, route = '/') => {
  const navigate = useNavigate()
  useEffect(() => {
    if (user === true) {
		navigate(route)
	}
  }, [user, route]);
  return {};
};

export default useUser;
