import React from "react";
import { Paper } from "@mui/material";
import { Subject } from "../../app/models/Subject";
import { useState } from "react";
import Colors from "../../app/static/colors";

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

export let addSubject: object[] = [];

export const ProgressCard = ({ subject, isLargeScreen, backgroundColorButton }: Props) => {
  const { code, name } = subject;
  
  const [backgroundColor, setBackgroundColor] = useState<string>(backgroundColorButton);
  const [addSubjectTest, setAddSubject] = useState<object[]>([]);

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
      // remove subject from array
      setAddSubject(prevSubjects => prevSubjects.filter((e: any) => e.subjectCode !== code));
    }
    
    // if user click on subject default, change to green
    if (
      backgroundColor === Colors.secondarySkyblue ||
      backgroundColor === Colors.white
    ) {
      setBackgroundColor(Colors.primaryGray);
      // add subject to array
      if (!addSubject.some((e: any) => e.subjectCode === code)) {
        setAddSubject(prevSubjects => [...prevSubjects, { subjectCode: code, isAdded: true }]);
      }
    }
  };

  addSubject = addSubjectTest;

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