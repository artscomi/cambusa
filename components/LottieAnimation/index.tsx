import { useLottie } from "lottie-react";
import emptyMealList from "./empty-meal-list.json";
import groovyWalkAnimation from "./groovy-walk.json";
import waveBig from "./waveBig.json";
import { useEffect, useState } from "react";

const animation = {
  groovyWalk: groovyWalkAnimation,
  emptyMealList: emptyMealList,
  waveBig,
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

  const { View, setSpeed } = useLottie(options);

  useEffect(() => {
    setSpeed(0.1);
  }, []);


  return View;
};

export default LottieAnimation;
