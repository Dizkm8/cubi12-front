import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Box, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import agent from "../../app/api/agent";
import SubjectCard from "./SubjectCard";
import { Subject } from "../../app/models/Subject";
import { useSubjectCodeContext } from "../../app/context/SubjectCodeContext";
import { PreRequisite } from "../../app/models/PreRequisite";
import { PostRequisite } from "../../app/models/PostRequisite";
import { subjectsCapitalize } from "../../app/utils/StringUtils";
import Agent from "../../app/api/agent";
import HelpIcon from "@mui/icons-material/Help";
import SquareIcon from "@mui/icons-material/Square";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import NearMeIcon from "@mui/icons-material/NearMe";
import Colors from "../../app/static/colors";
import GenerateTabTitle from "../../app/utils/TitleGenerator";

// Item style
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: Colors.primaryBlue,
  color: "#FFF",
  padding: theme.spacing(1),
  textAlign: "center",
}));

// Semester roman numerals for items
const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const romanNumeral = (numeral: number) => {
  return numerals[numeral - 1];
};

const subjectsState = [
  {
    type: "Asignaturas aprobadas",
    description: "Aquellas asignaturas que ya aprobaste en tu malla curricular",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.primaryGray }} />
    ),
  },
  {
    type: "Asignaturas por cursar",
    description:
      "Aquellas asignaturas que puedes cursar basado en lo que aprobaste",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.secondaryGreen }} />
    ),
  },
  {
    type: "Asignaturas fuera de proyección",
    description:
      "Aquellas asignaturas que puedes cursar pero que, probablemente, no pruebas inscribir por dispersión",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.secondaryYellow }} />
    ),
  },
  {
    type: "Asignaturas no cursadas",
    description:
      "Aquellas asignaturas que aun no cursas y que, probablemente, todavía no puedes cursar",
    icon: <SquareOutlinedIcon style={{ fontSize: "200%", color: "#000" }} />,
  },
];

const MyProgress = () => {
  document.title = GenerateTabTitle("Mi Progreso");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const preRequisites = useRef<PreRequisite>({});
  const PostRequisites = useRef<PostRequisite>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { setPreReqCodes, setPostReqCodes } = useSubjectCodeContext();

  const isLargeScreen = useMediaQuery("(min-width:1600px)");

  const [user, setUser] = useState({
    name: "",
    firstLastName: "",
    secondLastName: "",
    rut: "",
    email: "",
    career: { id: "", name: "" },
  });

  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  // Load user data
  useEffect(() => {
    if (localStorage.getItem("token")) {
      Agent.Auth.profile()
        .then((response) => {
          setUser(response);
        })
        .catch((error) => {
          console.error("Error loading user:", error);
        });
    }
  }, []);

  // Load subjects
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

  // Load pre-requisites
  useEffect(() => {
    agent.Subjects.preRequisites()
      .then((res) => {
        preRequisites.current = res;
      })
      .catch((err) => console.log(err));
  }, []);

  // Load post-requisites
  useEffect(() => {
    agent.Subjects.postRequisites()
      .then((res) => {
        PostRequisites.current = res;
      })
      .catch((err) => console.log(err));
  }, []);

  // Set pre-requisites colors
  const setPreRequisitesColors = (subjectPreRequisites: string[]) => {
    if (!subjectPreRequisites) return;
    setPreReqCodes(subjectPreRequisites);
  };

  // Set post-requisites colors
  const setPostRequisitesColors = (subjectPostRequisites: string[]) => {
    if (!subjectPostRequisites) return;
    setPostReqCodes(subjectPostRequisites);
  };

  // Handle mouse over subject
  const handleMouseOverSubject = (subjectCode: string) => {
    const subjectPreRequisites = preRequisites.current[subjectCode];
    setPreRequisitesColors(subjectPreRequisites);

    const subjectPostRequisites = PostRequisites.current[subjectCode];
    setPostRequisitesColors(subjectPostRequisites);
  };

  // Handle mouse exit subject
  const handleMouseExitSubject = () => {
    setPreReqCodes([]);
    setPostReqCodes([]);
  };

  // Map subjects by semester
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

  const openHelpDialog = () => {
    setHelpDialogOpen(true);
  };

  const closeHelpDialog = () => {
    setHelpDialogOpen(false);
  };

  // Map subjects by semester skeleton
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
          ¡Hola{" "}
          <Typography
            variant="h3"
            component="span"
            style={{ color: Colors.primaryBlue, display: "inline" }}
          >
            {user.name.split(" ")[0]}
          </Typography>
          ! Bienvenido a tu progreso
        </Typography>
        <HelpIcon
          style={{ fontSize: "350%", color: Colors.primaryOrange }}
          onClick={openHelpDialog}
        />
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
      <Grid
        container
        alignItems="center"
        style={{ marginLeft: "9%", width: "84%", marginBottom: "2%" }}
      >
        {subjectsState.map((subjectType, index) => (
          <React.Fragment key={index}>
            {subjectType.icon}
            <Typography
              variant="h3"
              component="span"
              style={{ fontSize: "100%", marginRight: "2%" }}
            >
              {subjectType.type}
            </Typography>
          </React.Fragment>
        ))}
        {/* Cancel button */}
        <Button
          name="cancel-button"
          variant="outlined"
          color="secondary"
          style={{
            color: `${Colors.primaryRed}`,
            transform: "scale(1.05)",
            fontFamily: "Raleway, sans-serif",
            fontSize: "85%",
            marginLeft: "auto",
          }}
        >
          Cancelar
        </Button>
        {/* Save button */}
        <Button
          name="update-button"
          type="submit"
          variant="contained"
          color="warning"
          style={{
            transform: "scale(1.05)",
            color: "white",
            marginLeft: "2%",
            backgroundColor: `${Colors.primaryBlue}`,
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
            fontFamily: "Raleway, sans-serif",
            fontSize: "85%",
          }}
        >
          Guardar
        </Button>
      </Grid>
      <Dialog open={helpDialogOpen} onClose={closeHelpDialog}>
        <DialogTitle
          style={{
            textAlign: "center",
            borderBottom: "2px solid black",
            fontSize: "250%",
          }}
        >
          Mi Progreso
        </DialogTitle>
        <DialogContent>
          <Typography
            style={{ paddingTop: "5%", paddingBottom: "2%", fontSize: "160%" }}
          >
            El significado de los colores
          </Typography>
          {subjectsState.map((subjectType, index) => (
            <React.Fragment key={index}>
              <Typography
                variant="subtitle1"
                style={{ marginTop: "2%", fontSize: "120%" }}
              >
                <Grid container alignItems="center">
                  {subjectType.icon} {subjectType.type}
                </Grid>
                <Typography
                  style={{ marginTop: "2%", fontSize: "80%", marginLeft: "8%" }}
                >
                  {subjectType.description}
                </Typography>
              </Typography>
            </React.Fragment>
          ))}
          <Typography
            style={{ paddingTop: "2%", paddingBottom: "2%", fontSize: "160%" }}
          >
            Su Uso
          </Typography>
          <Grid container alignItems="center">
            <NearMeIcon
              style={{ fontSize: "200%", color: Colors.primaryBlue }}
            />
            <Typography
              style={{ marginTop: "2%", fontSize: "125%", marginLeft: "2%" }}
            >
              Seleccionar una asignatura
            </Typography>
          </Grid>
          <Typography style={{ marginLeft: "8%", fontSize: "100%" }}>
            Seleccionar una asignatura la marcará como aprobada. Deseleccionar
            una asignatura previamente aprobada la marcará como no aprobada
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHelpDialog}></Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProgress;
