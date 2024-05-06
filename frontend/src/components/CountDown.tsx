import { Text, TextProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function CountDown({
  timeInSeconds,
  timeUp,
  ...props
}: {
  timeInSeconds: number;
  timeUp?: () => void;
} & TextProps) {
  const [time, setTime] = useState(0);
  const timeLeft = timeInSeconds - time;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => {
        if (time + 1 === timeInSeconds) {
          clearInterval(interval);
          timeUp && timeUp();
        }
        return time + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <Text {...props}>{timeLeft === 0 ? "Time up!" : timeLeft + "s"}</Text>;
}

export default CountDown;
