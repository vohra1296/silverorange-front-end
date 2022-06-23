import { useEffect, useState } from "react";
import BaseView from "./Components/BaseView";
import { Repo } from "./Types/repo";
import axios from "axios";

const APP = () => {
  const newRepos = [] as Repo[];
  const languages = new Map();
  const [data, setData] = useState();

  const sortRepos = (newRepos: []) => {
    const sortedRepos = newRepos.slice().sort((a: any, b: any) => {
      if (!languages.get(a.language)) {
        languages.set(a.language, a.language);
      } else if (!languages.get(b.language)) {
        languages.set(b.language, b.language);
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    return sortedRepos;
  };

  useEffect(() => {
    if (!data) {
      repos();
    }
  });

  const repos = async () => {
    const result = await axios.get("http://localhost:4000/repos");
    console.log(result);
    if (result.status === 200) {
      setData(result.data);
    }
  };

  if (data) {
    const reposData = sortRepos(data);
    reposData?.map((item: any) => {
      const repo = {} as Repo;
      repo.id = item.id;
      repo.name = item.name;
      repo.description = item.description;
      repo.commitUrl = item.commits_url;
      repo.createdAt = item.created_at;
      repo.language = item.language;
      repo.forksCount = item.forks_count;
      newRepos.push(repo);
      return repo;
    });
  }

  return (
    <div
      style={{
        margin: "40px",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <BaseView repos={newRepos} languages={languages} />
    </div>
  );
};

export default APP;
