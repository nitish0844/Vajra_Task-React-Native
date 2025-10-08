import { initAppLogsTable } from "@/utils/initLocalTempDatabase";
import { useQuery } from "@tanstack/react-query";

const InitializeAppLogsTable = ({ children }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['initAppLogsTable'],
    queryFn: () => initAppLogsTable(),
  });

  if (isLoading) {
    return null;
  }
  if (data?.success) {
    return children;
  }
  
  return null;
}

export default InitializeAppLogsTable;