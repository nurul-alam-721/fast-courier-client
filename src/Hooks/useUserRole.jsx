import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = "user",
    isLoading,
    isError,
    refetch,
  } = useQuery({
    enabled: !!user?.email && !loading,
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role?email=${user.email}`);
      return res.data.role || "user";
    },
  });

  return {
    role,
    roleLoading: loading || isLoading,
    isError,
    refetch,
  };
};

export default useUserRole;
