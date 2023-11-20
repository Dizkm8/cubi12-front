import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Box, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import agent from "../../app/api/agent";
import SubjectCard from "./SubjectCard";
import { Subject } from "../../app/models/Subject";
import { useSubjectCodeContext } from "../../app/context/SubjectCodeContext";
import { PreRequisite } from "../../app/models/PreRequisite";
import { PostRequisite } from "../../app/models/PostRequisite";
import { subjectsCapitalize } from "../../app/utils/StringUtils";
import GenerateTabTitle from "../../app/utils/TitleGenerator";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1C478F",
  color: "#FFF",
  padding: theme.spacing(1),
  textAlign: "center",
}));

const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const romanNumeral = (numeral: number) => {
  return numerals[numeral - 1];
};

const InteractiveMeshPage = () => {
  document.title = GenerateTabTitle("Malla Interactiva");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const preRequisites = useRef<PreRequisite>({});
  const PostRequisites = useRef<PostRequisite>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { setPreReqCodes, setPostReqCodes } = useSubjectCodeContext();

  const isLargeScreen = useMediaQuery("(min-width:1600px)");

  useEffect(() => {
    setLoading(true);
    agent.Subjects.list()
      .then((res: Subject[]) => {
        res.forEach((s) => (s.name = subjectsCapitalize(s.name)));
        setSubjects(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    agent.Subjects.preRequisites()
      .then((res) => {
        preRequisites.current = res;
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    agent.Subjects.postRequisites()
      .then((res) => {
        PostRequisites.current = res;
      })
      .catch((err) => console.log(err));
  }, []);

  const setPreRequisitesColors = (subjectPreRequisites: string[]) => {
    if (!subjectPreRequisites) return;
    setPreReqCodes(subjectPreRequisites);
  };

  const setPostRequisitesColors = (subjectPostRequisites: string[]) => {
    if (!subjectPostRequisites) return;
    setPostReqCodes(subjectPostRequisites);
  };

  const handleMouseOverSubject = (subjectCode: string) => {
    const subjectPreRequisites = preRequisites.current[subjectCode];
    setPreRequisitesColors(subjectPreRequisites);

    const subjectPostRequisites = PostRequisites.current[subjectCode];
    setPostRequisitesColors(subjectPostRequisites);
  };

  const handleMouseExitSubject = () => {
    setPreReqCodes([]);
    setPostReqCodes([]);
  };

  const mapSubjectsBySemester = (
    subjects: Subject[],
    semester: number,
    isLargeScreen: boolean
  ) =>
    subjects.map((subject) => {
      if (subject.semester === semester) {
        const mappedSubject = (
          <SubjectCard
            key={subject.code}
            subject={subject}
            onMouseOver={handleMouseOverSubject}
            onMouseExit={handleMouseExitSubject}
            isLargeScreen={isLargeScreen}
          />
        );
        return mappedSubject;
      }
      return null;
    });

  const mapSubjectsBySemesterSkeleton = (amount: number) => {
    return Array.from({ length: amount }).map((_, index) => (
      <Skeleton
        variant="rectangular"
        sx={{ width: "100%", height: "10vh", margin: "0.5rem 0" }}
      />
    ));
  };

  return (
    <Box sx={{ flexGrow: 1, padding: "0 1rem 0", marginTop: "1.5rem" }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        style={{ marginLeft: "9%", width: "84%" }}
      >
        <Typography variant="h3" component="span">
          Malla Interactiva
        </Typography>
      </Grid>
      <Grid container spacing={2} sx={{ margin: "0.1rem 0 1rem" }}>
        <Grid item xs={1} />
        {Array.from({ length: 10 }).map((_, index) => (
          <Grid item xs={12} md={3} lg={1} key={index}>
            <Item>{romanNumeral(index + 1)}</Item>
            {loading
              ? mapSubjectsBySemesterSkeleton(6)
              : mapSubjectsBySemester(subjects, index + 1, isLargeScreen)}
          </Grid>
        ))}
        <Grid item xs={1} />
      </Grid>
    </Box>
  );
};

export default InteractiveMeshPage;
