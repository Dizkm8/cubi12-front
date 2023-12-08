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
import { Subject } from "../../app/models/Subject";
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
import ProgressCard, { modifySubject } from "./ProgressCard";
import { forEach } from "lodash";

// Item style
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: Colors.primaryBlue,
  color: "#FFF",
  padding: theme.spacing(1),
  textAlign: "center",
}));

// Semester roman numerals for items
const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// Semester roman numeral generator
const romanNumeral = (numeral: number) => {
  return numerals[numeral - 1];
};

// Subjects state
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
      "Aquellas asignaturas que puedes cursar pero que, probablemente, no puedas inscribir por dispersión",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.secondaryYellow }} />
    ),
  },
  {
    type: "Asignaturas no cursadas",
    description:
      "Aquellas asignaturas que aún no cursas y que, probablemente, todavía no puedes cursar",
    icon: <SquareOutlinedIcon style={{ fontSize: "200%", color: "#000" }} />,
  },
];

export let approvedSubjects = [] as string[];

const MyProgressPage = () => {
  document.title = GenerateTabTitle("Mi Progreso");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const preRequisites = useRef<PreRequisite>({});
  const PostRequisites = useRef<PostRequisite>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [userApprovedSubjects, setUserApprovedSubjects] = useState<string[]>([]);

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
    Agent.Auth.profile()
    .then((response) => {
      setUser(response);
    })
    .catch((error) => {
      console.error("Error loading user:", error);
    });
  }, []);

  // Load user approved subjects
  useEffect(() => {
    Agent.Auth.myProgress()
    .then((response) => {
      console.log(response);
      const hardcode = ["iaf-001", "cal-001", "alg-001", "ing-001", "iue-001", "fge-001", "pii-001"]
      setUserApprovedSubjects(hardcode);
      approvedSubjects = hardcode;
    })
    .catch((error) => {
      console.error("Error loading user approved subjects:", error);
    });
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

  // Validate if subject has pre-requisites
  const hasPreReq = (subjectCode: string) => {
    let hasPreReq = true;
    const preReq = preRequisites.current[subjectCode];
    if (!preReq && !userApprovedSubjects.includes(subjectCode)) hasPreReq = false;
    else if (preReq) {
      forEach(preReq, (value) => {
        if (!userApprovedSubjects.includes(value)) hasPreReq = false;
      });
    }

    return hasPreReq;
  };

  const getPreReqLength = (subjectCode: string) => {
    const preReq = preRequisites.current[subjectCode];
    return preReq ? preReq.length : 0;
  };
  // Validate if subject is out of projection
  let studentLevel = Math.max(...subjects
    .filter(subject => userApprovedSubjects.includes(subject.code))
    .map(subject => subject.semester)
  );
  console.log('holaaa '+ studentLevel);
  console.log(subjects.filter(subject => !userApprovedSubjects.includes(subject.code)).map(subject => subject.semester));

  // Map subjects by semester
  const mapSubjectsBySemester = (
    subjects: Subject[],
    semester: number,
    isLargeScreen: boolean
  ) =>
    subjects.map((subject) => {
      if (subject.semester === semester) {
        
        const mappedSubject = (
          <ProgressCard
            key={subject.code}
            subject={subject}
            isLargeScreen={isLargeScreen}
          backgroundColorButton={ 
          userApprovedSubjects.includes(subject.code) ? Colors.primaryGray : 
          ((subject.semester > studentLevel + 2 && hasPreReq(subject.code)) || (subject.semester > studentLevel + 2 && getPreReqLength(subject.code) === 0)) ? Colors.secondaryYellow :
          hasPreReq(subject.code) ? Colors.secondaryGreen :
          Colors.white
        }
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

  const saveSubjects = () => {
    console.log("Saving subjects...");
    console.log(JSON.stringify(modifySubject, null, 2));
    setLoading(true);
    agent.Subjects.list()
      .then((res: Subject[]) => {
        res.forEach((s) => (s.name = subjectsCapitalize(s.name)));
        setSubjects(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
    modifySubject.addSubject = [];
    modifySubject.deleteSubject = [];
  };

  const cancelSubjects = () => {
    console.log("Canceling subjects...");
    // Delete all subjects from array
    modifySubject.addSubject = [];
    modifySubject.deleteSubject = [];
    setLoading(true);
    agent.Subjects.list()
      .then((res: Subject[]) => {
        res.forEach((s) => (s.name = subjectsCapitalize(s.name)));
        setSubjects(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  // Map subjects by semester skeleton
  const mapSubjectsBySemesterSkeleton = (amount: number) => {
    return Array.from({ length: amount }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        sx={{ width: "100%", height: "10vh", margin: "0.5rem 0" }}
      />
    ));
  };

  return (
    <Box sx={{ flexGrow: 1, padding: "0 1rem 0", marginTop: "1.5rem" }}>
      {/* My Progress */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        style={{ marginLeft: "9%", width: "84%" }}
      >
        {/* Title */}
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
      {/* Subject types top info */}
      <Grid
        container
        alignItems="center"
        style={{ marginLeft: "9%", width: "84%", marginTop: "1%" }}
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
          onClick={cancelSubjects}
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
          onClick={saveSubjects}
        >
          Guardar
        </Button>
      </Grid>
      {/* My Progress Mesh */}
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
      {/* Subject types pop-up info */}
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

export default MyProgressPage;
