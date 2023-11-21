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
}

export const addSubject: string[] = [];

export const ProgressCard = ({ subject, isLargeScreen }: Props) => {
  const { code, name } = subject;

  const [backgroundColor, setBackgroundColor] = useState<string>(Colors.white);

  const handleMouseOut = () => {
    if (
      backgroundColor === Colors.secondaryYellow ||
      backgroundColor === Colors.secondaryGreen
    )
      return;
    setBackgroundColor(Colors.white);
  };

  const handleMouseOver = () => {
    if (
      backgroundColor === Colors.secondaryYellow ||
      backgroundColor === Colors.secondaryGreen
    )
      return;
    setBackgroundColor(Colors.primaryGray);
  };

  // if user click on subject, change color
  const handleOnClick = () => {
    // if user click on green subject, change to white
    if (backgroundColor === Colors.secondaryGreen) {
      setBackgroundColor(Colors.white);
      const index = addSubject.indexOf(code);
      if (index > -1) {
        addSubject.splice(index, 1);
      }
    }
    // if user click on subject default, change to green
    if (
      backgroundColor === Colors.primaryGray ||
      backgroundColor === Colors.white
    ) {
      setBackgroundColor(Colors.secondaryGreen);
      addSubject.push(code);
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
