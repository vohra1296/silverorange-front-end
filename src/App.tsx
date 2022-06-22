import { useQuery } from "react-query";

const repos = async (): Promise<[]> =>
  await (await fetch("http://localhost:4000/repos")).json();

const APP = () => {
  const { data, isLoading, error } = useQuery<[]>("repos", repos);
  if (data) {
    console.log(data);
  }
  if (isLoading) {
    return null;
  }
  if (error) {
    return <h1>Something Went Wrong</h1>;
  }

  return <div />;
};

export default APP;
