import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import agent from "../../app/api/agent";
import SubjectCard from "./SubjectCard";
import { Subject } from "../../app/models/Subject";
import { useSubjectCodeContext } from "../../app/context/SubjectCodeContext";
import { PreRequisite } from "../../app/models/PreRequisite";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1C478F",
  color: "#FFF",
  padding: theme.spacing(1),
  textAlign: "center",
}));

const InteractiveMesh = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const subjectRelationships = useRef<PreRequisite>({});

  const { setCodes } = useSubjectCodeContext();

  const isLargeScreen = useMediaQuery("(min-width:1600px)");

  useEffect(() => {
    agent.Subjects.list()
      .then((res) => {
        setSubjects(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    agent.Subjects.preRequisites()
      .then((res) => {
        subjectRelationships.current = res;
      })
      .catch((err) => console.log(err));
  }, []);

  const handleMouseOverSubject = (event: any, subjectCode: string) => {
    const subjectPreRequisites = subjectRelationships.current[subjectCode];
    if (!subjectPreRequisites) return;

    setCodes(subjectPreRequisites);
  };

  const handleMouseExitSubject = (subjectCode: string) => {
    setCodes([]);
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

  return (
    <Box sx={{ flexGrow: 1, padding: "0 3rem 0", marginTop: "1.5rem" }}>
      <Typography variant="h3" component="h1">
        Malla Interactiva
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: "0.1rem" }}>
        <Grid item xs>
          <Item>I</Item>
          {mapSubjectsBySemester(subjects, 1, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>II</Item>
          {mapSubjectsBySemester(subjects, 2, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>III</Item>
          {mapSubjectsBySemester(subjects, 3, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>IV</Item>
          {mapSubjectsBySemester(subjects, 4, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>V</Item>
          {mapSubjectsBySemester(subjects, 5, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>VI</Item>
          {mapSubjectsBySemester(subjects, 6, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>VII</Item>
          {mapSubjectsBySemester(subjects, 7, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>VIII</Item>
          {mapSubjectsBySemester(subjects, 8, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>XI</Item>
          {mapSubjectsBySemester(subjects, 9, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>X</Item>
          {mapSubjectsBySemester(subjects, 10, isLargeScreen)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InteractiveMesh;
