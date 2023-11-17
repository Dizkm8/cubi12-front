import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import agent from "../../app/api/agent";

interface Subject {
  id: number;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: number;
}

// TODO: Implement unused interface
interface SubjectRelationship {
  id: number;
  subjectCode: string;
  preSubjectCode: string;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1C478F",
  color: "#FFF",
  padding: theme.spacing(1),
  textAlign: "center",
}));

const subjectStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "8vh",
  width: "100%",
  margin: "1rem 0",
  padding: "0.5rem",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "#C3C3C3",
  },
};

const getStyleByPhraseSize = (phrase: string, isLargeScreen: boolean) => {
  if (isLargeScreen) {
    if (phrase.length > 40) return { ...subjectStyle, fontSize: "0.8rem" };
    return subjectStyle;
  }
  if (phrase.length > 30) return { ...subjectStyle, fontSize: "0.7rem" };
  else if (phrase.length > 25) return { ...subjectStyle, fontSize: "0.8rem" };
  else if (phrase.length > 20) return { ...subjectStyle, fontSize: "0.9rem" };
  else return subjectStyle;
};

const InteractiveMesh = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const subjectRelationships = useRef<any>({});
  const [subjectStyles, setSubjectStyles] = useState<{
    [key: string]: React.CSSProperties;
  }>({});

  const isLargeScreen = useMediaQuery("(min-width:1600px)");

  const handleMouseOverSubject = (event: any, subjectCode: string) => {
    const subjectPreRequisites = subjectRelationships.current[subjectCode];
    if (!subjectPreRequisites) return;

    const updatedStyles = { ...subjectStyles };
    subjectPreRequisites.forEach((preReqCodes: string) => {
      updatedStyles[preReqCodes] = { backgroundColor: "#FFDE9A" };
    });

    setSubjectStyles(updatedStyles);
  };

  const handleMouseExitSubject = (subjectCode: string) => {
    const subjectPreRequisites = subjectRelationships.current[subjectCode];
    if (!subjectPreRequisites) return;

    const updatedStyles = { ...subjectStyles };
    subjectPreRequisites.forEach((preReqCodes: string) => {
      updatedStyles[preReqCodes] = {};
    });

    setSubjectStyles(updatedStyles);
  };

  const mapSubjects = (
    subjects: Subject[],
    semester: number,
    isLargeScreen: boolean
  ) => {
    return subjects.map((subject) => {
      if (subject.semester === semester) {
        return (
          <Paper
            onMouseOver={(e) => handleMouseOverSubject(e, subject.code)}
            onMouseOut={() => handleMouseExitSubject(subject.code)}
            elevation={3}
            sx={{
              ...subjectStyles[subject.code],
              ...getStyleByPhraseSize(subject.name, isLargeScreen),
            }}
            key={subject.code}
          >
            {subject.name}
          </Paper>
        );
      }
      return null;
    });
  };

  useEffect(() => {
    agent.Subjects.list()
      .then((res) => {
        setSubjects(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    agent.Subjects.relationships()
      .then((res) => {
        subjectRelationships.current = res;
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: "0 3rem 0", marginTop: "1.5rem" }}>
      <Typography variant="h3" component="h1">
        Malla Interactiva
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: "0.1rem" }}>
        <Grid item xs>
          <Item>I</Item>
          {mapSubjects(subjects, 1, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>II</Item>
          {mapSubjects(subjects, 2, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>III</Item>
          {mapSubjects(subjects, 3, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>IV</Item>
          {mapSubjects(subjects, 4, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>V</Item>
          {mapSubjects(subjects, 5, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>VI</Item>
          {mapSubjects(subjects, 6, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>VII</Item>
          {mapSubjects(subjects, 7, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>VIII</Item>
          {mapSubjects(subjects, 8, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>XI</Item>
          {mapSubjects(subjects, 9, isLargeScreen)}
        </Grid>
        <Grid item xs>
          <Item>X</Item>
          {mapSubjects(subjects, 10, isLargeScreen)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InteractiveMesh;
