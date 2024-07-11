"use client";
import { useEffect, useRef } from "react";
import {Holistic} from "@mediapipe/holistic";
import {Camera } from "@mediapipe/camera_utils"
import {
  POSE_CONNECTIONS,
  HAND_CONNECTIONS,
  FACEMESH_TESSELATION,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
} from "@mediapipe/pose";
import useFPS from "./useFPS";
import useControlPanel from "./useControlPanel";

const MyHolisticComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);
  const fpsControlRef = useRef(null);
  const holisticRef = useRef(null);
  const cameraRef = useRef(null);
  const tick = useFPS();
  const [settings, toggleSetting, setSliderValue] = useControlPanel({
    selfieMode: true,
    upperBodyOnly: true,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const controlsElement = controlsRef.current;
    const canvasCtx = canvas.getContext("2d");

    // const holistic = new Holistic();

    const holistic = new holistic({locateFile: (file) => {
        return  './@mediapipe/holistic/${file}';
        }});
    holisticRef.current = holistic;

    holistic.onResults(onResultsHolistic);

    const camera = new Camera(video, {
      onFrame: async () => {
        await holistic.send({ image: video });
      },
      width: 480,
      height: 480,
    });
    cameraRef.current = camera;

    camera.start();

    // new ControlPanel(controlsElement, {
    //   selfieMode: true,
    //   upperBodyOnly: true,
    //   smoothLandmarks: true,
    //   minDetectionConfidence: 0.5,
    //   minTrackingConfidence: 0.5,
    // })
    //   .add([
    //     new StaticText({ title: "MediaPipe Holistic" }),
    //     fpsControl,
    //     new Toggle({ title: "Selfie Mode", field: "selfieMode" }),
    //     new Toggle({ title: "Upper-body Only", field: "upperBodyOnly" }),
    //     new Toggle({ title: "Smooth Landmarks", field: "smoothLandmarks" }),
    //     new Slider({
    //       title: "Min Detection Confidence",
    //       field: "minDetectionConfidence",
    //       range: [0, 1],
    //       step: 0.01,
    //     }),
    //     new Slider({
    //       title: "Min Tracking Confidence",
    //       field: "minTrackingConfidence",
    //       range: [0, 1],
    //       step: 0.01,
    //     }),
    //   ])
    //   .on((options) => {
    //     video.classList.toggle("selfie", options.selfieMode);
    //     holistic.setOptions(options);
    //   });

    return () => {
      camera.stop();
      holistic.close();
    };
  }, []);

  const onResultsHolistic = (results) => {
    document.body.classList.add("loaded");
    removeLandmarks(results);
    const fps = tick();
    fpsControlRef.current.tick();

    const canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasCtx.lineWidth = 5;

    if (results.poseLandmarks) {
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#00FF00",
        fillColor: "#FF0000",
      });
    }

    if (results.rightHandLandmarks) {
      drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: "#00CC00",
      });
      drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: "#00FF00",
        fillColor: "#FF0000",
        lineWidth: 2,
        radius: (data) => {
          return lerp(data.from.z, -0.15, 0.1, 10, 1);
        },
      });
    }

    if (results.leftHandLandmarks) {
      drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: "#CC0000",
      });
      drawLandmarks(canvasCtx, results.leftHandLandmarks, {
        color: "#FF0000",
        fillColor: "#00FF00",
        lineWidth: 2,
        radius: (data) => {
          return lerp(data.from.z, -0.15, 0.1, 10, 1);
        },
      });
    }

    if (results.faceLandmarks) {
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
      });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {
        color: "#FF3030",
      });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {
        color: "#FF3030",
      });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {
        color: "#30FF30",
      });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {
        color: "#30FF30",
      });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {
        color: "#E0E0E0",
      });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {
        color: "#E0E0E0",
      });
    }

    canvasCtx.restore();
  };
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "@/mediapipe/camera_utils/camera_utils.js";
    script1.async = true;
    document.body.appendChild(script1);
  
    const script2 = document.createElement("script");
    script2.src = "@/mediapipe/drawing_utils/drawing_utils.js";
    script2.async = true;
    document.body.appendChild(script2);
  
    const script3 = document.createElement("script");
    script3.src = "@/mediapipe/pose/pose.js";
    script3.async = true;
    document.body.appendChild(script3);
  
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      document.body.removeChild(script3);
    };
  }, []);
  return (
    <div>
      <video className="input_video4" ref={videoRef}></video>
      <canvas className="output4" ref={canvasRef}></canvas>
      <div className="control4" ref={controlsRef}></div>
      <script
        async
        src="/opencv.js"
        onLoad="initOpenCV();"
        type="text/javascript"
      ></script>
    </div>
  );
};

export default MyHolisticComponent;
