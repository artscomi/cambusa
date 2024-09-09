import { useLottie } from "lottie-react";
import groovyWalkAnimation from "./groovyWalk.json";
import { useEffect, useState } from "react";

const LottieAnimation = () => {
  const [height, setHeight] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setHeight(200);
      } else if (window.innerWidth < 1024) {
        setHeight(100);
      } else {
        setHeight(250);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const options = {
    animationData: groovyWalkAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, { height });

  return View;
};

export default LottieAnimation;
