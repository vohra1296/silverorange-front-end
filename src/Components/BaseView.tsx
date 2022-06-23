import { Repo, Owner } from "../Types/repo";
import axios from "axios";
import moment from "moment";
import {
  Grid,
  Chip,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { Code, ExpandMore } from "@material-ui/icons";
import { useState, useEffect } from "react";

interface Props {
  repos: Repo[];
  languages: Map<any, any>;
}

const BASEVIEW: React.FC<Props> = ({ repos, languages }) => {
  const [url, setUrl] = useState("");
  const [owner, setOwner] = useState({} as Owner);
  const [allRepos, setAllRepos] = useState([] as Repo[]);
  console.log("repos", repos);
  const newLang = Array.from(languages.keys());
  newLang.push("All");

  useEffect(() => {
    if (repos) {
      setAllRepos(repos);
    }
  }, [repos]);

  const setCommitInfo = async (repo: Repo) => {
    if (repo) {
      const url = repo.commitUrl.split("{")[0];
      setUrl(url);
    }
  };

  useEffect(() => {
    if (url !== "") {
      getCommitData(url);
    }
  }, [url]);

  const getCommitData = async (url: string) => {
    try {
      const result = await axios.get(url);
      const commit = result.data[0].commit;
      const author = {
        author: commit.author.name,
        commitDate: moment(commit.author.date).format("YYYY-MM-DD hh:mm"),
        message: commit.message,
      };
      setOwner(author);
    } catch (error) {
      console.log(error);
    }
  };

  const setFilteredData = (key: string) => {
    console.log(key);
    let newRepos: Repo[] = [];
    if (repos) {
      repos.map((repo) => {
        if (repo.language === key) {
          newRepos.push(repo);
        } else if (key === "All") {
          newRepos = repos;
        }
        return null;
      });
    }
    setAllRepos(newRepos);
  };

  return (
    <div
      style={{
        margin: "80px",
        alignItems: "center",
        marginLeft: "20%",
      }}
    >
      <h1 style={{ marginLeft: "35%", color: "whitesmoke" }}>Repositories</h1>
      <div style={{ marginTop: "5%" }}>
        <Grid container={true} spacing={3}>
          {newLang?.map((key: any) => (
            <Grid item={true} key={key} xs={12} sm={2}>
              <Chip
                icon={<Code />}
                label={key}
                onClick={() => {
                  setFilteredData(key);
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12} sm={12}>
            <Accordion style={{ width: "1200px" }}>
              <AccordionSummary
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography style={{ width: "40%", flexShrink: 0 }}>
                  Name
                </Typography>
                <Typography style={{ width: "20%", flexShrink: 0 }}>
                  Forks Count
                </Typography>
                <Typography style={{ width: "20%", flexShrink: 0 }}>
                  Language
                </Typography>
                <Typography style={{ width: "20%", flexShrink: 0 }}>
                  Description
                </Typography>
              </AccordionSummary>
            </Accordion>
          </Grid>
        </Grid>
        <Grid container={true} spacing={3}>
          {allRepos?.map((repo) => (
            <Grid item={true} xs={12} sm={12} key={repo.id}>
              <Accordion
                style={{ width: "1200px" }}
                onClick={() => {
                  setCommitInfo(repo);
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography style={{ width: "40%", flexShrink: 0 }}>
                    {repo.name.toUpperCase()}
                  </Typography>
                  <Typography
                    style={{ color: "grey", width: "20%", flexShrink: 0 }}
                  >
                    {repo.forksCount}
                  </Typography>
                  <Typography
                    style={{ color: "grey", width: "20%", flexShrink: 0 }}
                  >
                    {repo.language}
                  </Typography>
                  <Typography
                    style={{ color: "grey", width: "20%", flexShrink: 0 }}
                  >
                    {repo.description ? repo.description : "No Description"}
                  </Typography>
                </AccordionSummary>
                {owner ? (
                  <AccordionDetails>
                    <Grid container={true} spacing={3}>
                      <Grid item={true} style={{ width: "100%" }}>
                        <Typography>
                          <h5>Author :</h5>
                          {owner.author}
                        </Typography>
                      </Grid>
                      <Grid item={true} style={{ width: "100%" }}>
                        <Typography>
                          <h5>Date :</h5>
                          {owner.commitDate}
                        </Typography>
                      </Grid>
                      <Grid item={true} style={{ width: "100%" }}>
                        <Typography>
                          <h6>Message :</h6>
                          {owner.message}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                ) : (
                  <AccordionDetails>
                    <Typography>
                      Fetching Latest Commit Messages ....
                    </Typography>
                  </AccordionDetails>
                )}
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default BASEVIEW;
