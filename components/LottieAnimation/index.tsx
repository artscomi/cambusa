import { useLottie } from "lottie-react";
import groovyWalkAnimation from "./groovyWalk.json";

const style = {
  height: 300,
};

const LottieAnimation = () => {
  const options = {
    animationData: groovyWalkAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);

  return View;
};

export default LottieAnimation;