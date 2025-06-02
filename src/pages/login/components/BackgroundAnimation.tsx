import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export const BackgroundParticles = () => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "#2c5364" },
        particles: {
          number: { value: 50 },
          size: { value: 3 },
          move: { direction: "top", speed: 0.5 },
          opacity: { value: 0.3 },
        },
        fullScreen: { zIndex: 0 },
      }}
    />
  );
};
