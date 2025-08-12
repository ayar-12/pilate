// src/context/AppContext.jsx
import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
const backendUrl = rawBackendUrl.replace(/\/+$/, ''); // strip trailing slash

  const location = useLocation();


  const [isLoggedin, setIsLoggedin]   = useState(false);
  const [userData, setUserData]       = useState(null);
const [calorieProfile, setCalorieProfile] = useState(null);
const [stepData, setStepData] = useState({ steps: 0, message: '', chartData: [] });
  const [courses, setCourses]         = useState([]);
  const [blogs, setBlogs]             = useState([]);

  const [isLoading, setIsLoading]     = useState(true);

  const [waterToday, setWaterToday]   = useState(0);
  const [lastDrinkTime, setLastDrinkTime] = useState(null);

  const [homeData, setHomeData]       = useState(null);
  const [classData, setClassData]     = useState(null);

  const [searchQuery, setSearchQuery] = useState("");



  const addCourse    = (c)   => setCourses(prev => [c, ...prev]);
  const updateCourse = (upd) => setCourses(prev => prev.map(x => x._id === upd._id ? upd : x));
  const deleteCourse = (id)  => setCourses(prev => prev.filter(x => x._id !== id));

  // --- Blog helpers ---
  const addBlog      = (b)   => setBlogs(prev => [b, ...prev]);
  const updateBlog   = (upd) => setBlogs(prev => prev.map(x => x._id === upd._id ? upd : x));
  const deleteBlog   = (id)  => setBlogs(prev => prev.filter(x => x._id !== id));
  const toggleFavoriteBlog = (id) =>
    setBlogs(prev => prev.map(x => x._id === id ? { ...x, isFavorite: !x.isFavorite } : x));

  // --- Fetchers ---
  const getAllCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/courses`);
      console.log("API call result:", data);
if (data.success) {
  console.log("Setting courses:", data.data);
  setCourses(data.data);
}

    } catch (err) {
      console.error(err);
      toast.error("Could not load courses.");
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

const getAllBlogs = useCallback(async () => {
  try {
    // 1) Fetch all blogs
    const { data } = await axios.get(`${backendUrl}/api/blog/blogs`);
    let allBlogs = data.success ? data.data : [];

    // 2) If logged in, fetch favorites
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const favRes = await axios.get(`${backendUrl}/api/blog/blogs/favorites`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });

        const favIds = new Set((favRes.data?.data || []).map(f => f._id));
        allBlogs = allBlogs.map(b => ({
          ...b,
          isFavorite: favIds.has(b._id)
        }));
      }
    } catch (favErr) {
      console.warn("Failed to fetch favorites:", favErr);
    }

    // 3) Save merged list
    setBlogs(allBlogs);

  } catch (err) {
    console.error(err);
    toast.error("Could not load blogs.");
  }
}, [backendUrl]);

const toggleFavorite = async (blogId) => {
  try {
    if (!blogId) return;

    if (!isLoggedin) {
      toast.error("Please log in to add favorites");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // optimistic update
    toggleFavoriteBlog(blogId);

     const response = await axios.put(
   `${backendUrl}/api/blog/blogs/${blogId}/favorite`,
  {},
  { withCredentials: true, headers }
);

    if (response.data?.success) {
      toast.success(response.data?.message || "Favorite updated successfully");
    }

    // refresh favorites
    try {
      const favRes = await axios.get(
        `${backendUrl}/api/blog/blogs/favorites`,
        { headers, withCredentials: true }
      );
      if (favRes.data?.success) {
        const favIds = (favRes.data?.data || []).map(b => b._id);
        setBlogs(prev => prev.map(b => ({ ...b, isFavorite: favIds.includes(b._id) })));
      }
    } catch (refreshErr) {
      console.warn('Failed to refresh favorites:', refreshErr);
    }

  } catch (err) {
    // rollback
    toggleFavoriteBlog(blogId);
    const msg = err.response?.data?.message || 'Failed to toggle favorite';
    toast.error(msg);
    if (err.response?.status === 401) {
      setIsLoggedin(false);
      setUserData(null);
    }
  }
}


  const getHomeData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/home`);
      if (data.success && Array.isArray(data.data) && data.data.length) {
        setHomeData(data.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [backendUrl]);

  const getClassData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/class-widget`);
      setClassData(data.success && data.data.length ? data.data[0] : null);
    } catch {
      setClassData(null);
    }
  }, [backendUrl]);

  const getTodayWater = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/water/today`, { withCredentials: true });
      if (data.success) {
        setWaterToday(data.total);
        setLastDrinkTime(data.lastDrinkAt);
      }
    } catch {
      /* ignore */
    }
  }, [backendUrl]);

 const getUserDataReq = useCallback(async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
    if (data.success) {
      setUserData(data.user);
      await getTodayWater();
    } else {
      setUserData(null);
    }
  } catch (err) {
    console.error('getUserData 500:', err.response?.data || err.message);
    setUserData(null);
  }
}, [backendUrl, getTodayWater]);

const fetchStepData = useCallback(async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/steps`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const chartData = Array.isArray(res.data.data)
      ? res.data.data.map(entry => ({
          name: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
          points: entry.steps,
        }))
      : [];

    const latest = chartData.at(-1)?.points || 0;

    setStepData({
      steps: latest,
      message: latest > 5000 ? "You're walking more than you usually do." : "Keep going!",
      chartData,
    });
  } catch (err) {
    console.error("Error fetching step data:", err);
  }
}, [backendUrl]);


const getCalorieProfile = useCallback(async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/profile`, { withCredentials: true });
    if (data.success && data.data?.calculations) {
      setCalorieProfile(data.data.calculations);
    }
  } catch (err) {
    console.error("Failed to fetch calorie profile", err);
    setCalorieProfile(null);
  }
}, [backendUrl]);


  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, { withCredentials: true });
      if (data.success) {
        setIsLoggedin(true);
        await getUserDataReq();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch {
      setIsLoggedin(false);
      setUserData(null);
      if (["/login", "/register"].includes(location.pathname)) {
        toast.error("Not authorized");
      }
    }
  }, [backendUrl, location.pathname, getUserDataReq]);

  const logout = useCallback(async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out");
      }
    } catch {
      toast.error("Logout failed");
    }
  }, [backendUrl]);

  // --- Init on path change ---
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (["/login", "/register"].includes(location.pathname)) {
        await Promise.all([getAllCourses(), getAllBlogs(), getHomeData()]);
        return;
      }

      await Promise.all([
        getAuthState(),
        getAllCourses(),
        getAllBlogs(),
        getHomeData(),
        getClassData(),
        getTodayWater(),
      ]);

      if (!cancelled) {
 
      }
    };

    init();
    return () => { cancelled = true; };
  }, [
    location.pathname,
    getAuthState,
    getAllCourses,
    getAllBlogs,
    getHomeData,
    getClassData,
    getTodayWater,
  ]);

  return (
    <AppContext.Provider
      value={{
        backendUrl,

        // auth
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData: getUserDataReq,
        logout,

        // data
        courses,
        blogs,
        homeData,
        classData,
        waterToday,
        lastDrinkTime,

        // UI state
        isLoading,
        searchQuery,
        setSearchQuery,

        // course actions
        addCourse,
        updateCourse,
        deleteCourse,
        getAllCourses,

        // blog actions
        addBlog,
        updateBlog,
        deleteBlog,
        getAllBlogs,
        toggleFavorite,
        toggleFavoriteBlog,
    // calorie profile
    calorieProfile,
    getCalorieProfile,
        // misc fetchers
        getHomeData,
        getClassData,
        getTodayWater,
        stepData,
fetchStepData,
 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
