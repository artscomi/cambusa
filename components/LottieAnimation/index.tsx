import { useLottie } from "lottie-react";
import { useEffect, useState } from "react";

const animation = {
  groovyWalk: () => import("./groovy-walk.json"),
  emptyMealList: () => import("./empty-meal-list.json"),
  waveBig: () => import("./waveBig.json"),
};

type AnimationType = keyof typeof animation;

const LottieAnimation = ({
  name,
  speed,
  isResponsive = true,
  autoplay = true,
}: {
  name: AnimationType;
  speed?: number;
  isResponsive?: boolean;
  autoplay?: boolean;
}) => {
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [isMounted, setIsMounted] = useState(false);

  const calculateHeight = () => {
    if (!isMounted || typeof window === "undefined") {
      return 220; // Default height for SSR
    }

    if (window.innerWidth < 600) {
      return 200;
    } else if (window.innerWidth < 1024) {
      return 100;
    } else {
      return 220;
    }
  };

  const options = {
    animationData,
    loop: true,
    autoplay,
  };

  const { View, setSpeed } = useLottie(
    options,
    isResponsive ? { height: calculateHeight() } : {}
  );

  if (speed) setSpeed(speed);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load the animation data based on the name
  useEffect(() => {
    const loadAnimation = async () => {
      const data = await animation[name]();
      setAnimationData(data);
    };

    loadAnimation();
  }, [name]);

  return View;
};

export default LottieAnimation;
