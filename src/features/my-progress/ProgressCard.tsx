import React from "react";
import { Paper } from "@mui/material";
import { Subject } from "../../app/models/Subject";
import { useState } from "react";
import Colors from "../../app/static/colors";

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

const ProgressCard = ({ subject, isLargeScreen }: Props) => {
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

  const handleOnClick = () => {
    if (backgroundColor === Colors.secondaryGreen) {
      setBackgroundColor(Colors.white);
    }
    if (
      backgroundColor === Colors.primaryGray ||
      backgroundColor === Colors.white
    ) {
      setBackgroundColor(Colors.secondaryGreen);
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
