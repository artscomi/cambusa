import { useLottie } from "lottie-react";
import emptyMealList from "./empty-meal-list.json";
import groovyWalkAnimation from "./groovy-walk.json";
import { useEffect, useState } from "react";

const animation = {
  groovyWalk: groovyWalkAnimation,
  emptyMealList: emptyMealList,
};

type AnimationType = keyof typeof animation;

const LottieAnimation = ({ name }: { name: AnimationType }) => {
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
    animationData: animation[name],
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, { height });

  return View;
};

export default LottieAnimation;
