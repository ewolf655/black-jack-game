import axios from "axios";
import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateRoundData } from "../redux/gameSlice";

const useSecurityKey = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [telegramId, setTelegramId] = useState();
  const [securityKey, setSecurityKey] = useState();

  useEffect(() => {
    let ac = new AbortController();

    if (location.pathname !== "/error") {
      const telegramId = searchParams.get("telegramId");
      const key = searchParams.get("key");

	  if (telegramId !== undefined && key !== undefined) {
		axios
			.get(`${API_URL}/security?telegramId=${telegramId}&key=${key}`)
			.then((r) => {
			if (ac.signal.aborted === false) {
				if (r.data.status === true) {
				setTelegramId(telegramId);
				setSecurityKey(key);
				dispatch(updateRoundData(r.data.round))
				} else {
				navigate("/error", { state: { error: r.data.error } });
				}
			}
			})
			.catch((err) => {
			console.error(err);
			navigate("/error", { state: { error: err.message } });
			});
		}
    }

    return () => ac.abort();
  }, [searchParams, navigate, location.pathname, dispatch]);

  return { telegramId, securityKey };
};

export default useSecurityKey;
