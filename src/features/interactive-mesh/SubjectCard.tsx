import { Paper } from "@mui/material";
import { Subject } from "../../app/models/Subject";
import { useSubjectCodeContext } from "../../app/context/SubjectCodeContext";
import { useEffect, useState } from "react";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "8vh",
  width: "100%",
  margin: "1rem 0",
  padding: "0.5rem",
  fontSize: "1rem",
  backgroundColor: "#FFF",
  "&:hover": {
    backgroundColor: "#C3C3C3",
  },
};

const getStyleByPhraseSize = (
  currentStyle: any,
  phrase: string,
  isLargeScreen: boolean
) => {
  if (isLargeScreen) {
    if (phrase.length > 40) return { ...currentStyle, fontSize: "0.8rem" };
    return currentStyle;
  }
  if (phrase.length > 30) return { ...currentStyle, fontSize: "0.7rem" };
  else if (phrase.length > 25) return { ...currentStyle, fontSize: "0.8rem" };
  else if (phrase.length > 20) return { ...currentStyle, fontSize: "0.9rem" };
  else return currentStyle;
};

interface Props {
  subject: Subject;
  onMouseOver: (e: any, code: string) => void;
  onMouseExit: (code: string) => void;
  isLargeScreen: boolean;
}

const SubjectCard = ({
  subject,
  isLargeScreen,
  onMouseOver,
  onMouseExit,
}: Props) => {
  const { code, name } = subject;

  const { codes } = useSubjectCodeContext();

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsHovered(codes.includes(code));
  }, [codes, code]);

  return (
    <Paper
      onMouseOver={(e) => onMouseOver(e, code)}
      onMouseOut={() => onMouseExit(name)}
      elevation={3}
      sx={getStyleByPhraseSize(
        isHovered ?  { ...style, backgroundColor: "#FFDE9A" } : {...style, backgroundColor: "#FFFFFF" },
        name,
        isLargeScreen
      )}
    >
      {name}
    </Paper>
  );
};

export default SubjectCard;
