import React from "react";
import { Paper } from "@mui/material";
import { Subject } from "../../app/models/Subject";
import { useState } from "react";
import Colors from "../../app/static/colors";
import { approvedSubjects } from "./MyProgressPage";

// subject style
const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "10vh",
  width: "100%",
  margin: "1rem 0",
  padding: "0.5rem",
  fontSize: "1rem",
  backgroundColor: "#FFF",
};

// subject fontsize
const getFontSizeByLength = (
  currentStyle: any,
  phrase: string,
  isLargeScreen: boolean
) => {
  if (isLargeScreen) {
    if (phrase.length > 40) return { ...currentStyle, fontSize: "0.8rem" };
    return currentStyle;
  }
  if (phrase.length > 40) return { ...currentStyle, fontSize: "0.6rem" };
  if (phrase.length > 35) return { ...currentStyle, fontSize: "0.7rem" };
  else if (phrase.length > 30) return { ...currentStyle, fontSize: "0.8rem" };
  else if (phrase.length > 20) return { ...currentStyle, fontSize: "0.9rem" };
  else return currentStyle;
};

// subject style
const selectStyle = (
  name: string,
  isLargeScreen: boolean,
  backgroundColor: string
) => {
  return {
    ...getFontSizeByLength(style, name, isLargeScreen),
    backgroundColor,
  };
};

interface Props {
  subject: Subject;
  isLargeScreen: boolean;
  backgroundColorButton: string;
}

export const modifySubject = {
  addSubject: [] as string[],
  deleteSubject: [] as string[],
};

export const ProgressCard = ({ subject, isLargeScreen, backgroundColorButton }: Props) => {
  const { code, name } = subject;

  const [backgroundColor, setBackgroundColor] = useState<string>(backgroundColorButton);

  // if user hover on subject, change color
  const handleMouseOut = () => {
    if (
      backgroundColor === Colors.secondaryYellow ||
      backgroundColor === Colors.primaryGray ||
      backgroundColor === Colors.secondaryGreen
    )
      return;
    setBackgroundColor(Colors.white);
  };

  // if user hover out subject, change color
  const handleMouseOver = () => {
    if (
      backgroundColor === Colors.secondaryYellow ||
      backgroundColor === Colors.primaryGray ||
      backgroundColor === Colors.secondaryGreen
    )
      return;
    setBackgroundColor(Colors.secondarySkyblue);
  };

  // if user click on subject, change color
  const handleOnClick = () => {
    // if user click on green subject, change to white
    if (backgroundColor === Colors.primaryGray) {
      setBackgroundColor(Colors.white);
      // if subject is in approved subjects array, add subject to delete on array
      if(approvedSubjects.includes(code)) {
        modifySubject.deleteSubject.push(code);
      }
      else {
        const index = modifySubject.addSubject.indexOf(code);
        if (index !== -1) {
          modifySubject.addSubject.splice(index, 1);
        }
      }
    }
    
    // if user click on subject default, change to green
    if (
      backgroundColor === Colors.secondarySkyblue ||
      backgroundColor === Colors.white ||
      backgroundColor === Colors.secondaryGreen
    ) {
      setBackgroundColor(Colors.primaryGray);
      // add subject to array
      if(!approvedSubjects.includes(code)) {
        modifySubject.addSubject.push(code);
      }
      else {
        const index = modifySubject.deleteSubject.indexOf(code);
        if (index !== -1) {
          modifySubject.deleteSubject.splice(index, 1);
        }
      }
    }
  };

  return (
    <Paper
      onMouseOver={() => handleMouseOver()}
      onMouseOut={() => handleMouseOut()}
      onClick={() => handleOnClick()}
      elevation={3}
      sx={selectStyle(name, isLargeScreen, backgroundColor)}
    >
      {name}
    </Paper>
  );
};

export default ProgressCard;
