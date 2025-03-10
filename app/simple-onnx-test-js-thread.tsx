import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Button,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Camera,
  DrawableFrame,
  Frame,
  runAsync,
  runAtTargetFps,
  useCameraDevice,
  useFrameProcessor,
  useSkiaFrameProcessor,
} from "react-native-vision-camera";

import { useCameraPermissions } from "expo-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { InferenceSession } from "onnxruntime-react-native";

import {
  useRunOnJS,
  useSharedValue,
  Worklets,
} from "react-native-worklets-core";
import { useEffect, useMemo, useState } from "react";
// import { runOnJS } from "react-native-reanimated";
import { PaintStyle, Skia } from "@shopify/react-native-skia";

import * as ort from "onnxruntime-react-native";

import { Asset } from "expo-asset";


async function getModelAsset() {
  try {
    const assets = await Asset.loadAsync(require("../assets/simple-model.onnx"));

    const modelUri = assets[0].localUri;

    if (!modelUri) {
      throw new Error(`failed to get model URI: ${assets[0]}`);
    } else {
      console.log("model asset loaded.");
      return modelUri;
    }
  } catch (e) {
    Alert.alert("failed to load model", `${e}`);
    throw e;
  }
}

async function createSession(modelUri: string) {
  try {
    
    const inferenceSession = await ort.InferenceSession.create(modelUri, {
      logSeverityLevel: 0,
      enableProfiling: true,
      logId: "testlog",
      logVerbosityLevel: 0,
      profileFilePrefix: "Logging",
    });

    console.log("inferenceSession created.");
    console.log(
      `input names: ${inferenceSession.inputNames}, output names: ${inferenceSession.outputNames}`
    );
    return inferenceSession;
  } catch (e) {
    console.log("failed to create model session.", `${e}`);
    throw e;
  }
}

// async function runSession(session: InferenceSession, feeds: Record<string, any>){
async function runSession(session: InferenceSession){
  "worklet";
  const t1 = Date.now();
  
  console.log(`inside runSession.`);
  
  const dataA = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const dataB = Float32Array.from([
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120,
  ]);

  let inputTensorA = {
    data: dataA,
    dataLocation: "cpu",
    type: "uint8",
    dims: [1, 3, 576, 320],
    size: 3 * 576 * 320,
  } as unknown as ort.Tensor;

  let inputTensorB = {
    data: dataB,
    dataLocation: "cpu",
    type: "uint8",
    dims: [1, 3, 576, 320],
    size: 3 * 576 * 320,
  } as unknown as ort.Tensor;

  console.log("made tensors..");

  const feeds = { a: inputTensorA, b: inputTensorB };
  console.log(`feeds: ${feeds}`);

  console.log("running session..");
  try {
    const runResult = await session.run(feeds); // TypeError: session.run is not a function (it is undefined)
    console.log(`runResult: ${runResult}`);
  }
  catch (ex){
    console.log(`session run threw an error: ${ex}`);
  }
  

  const t2 = Date.now();
  const diff = t2 - t1;
  console.log(`Frame Processed: ${diff / 1000}s`);
  
  session.endProfiling();
  session.release();
}

const runSessionJs = Worklets.createRunOnJS(runSession);

export default function ModalScreen() {
  const name = useSharedValue("hello");
  const [permission, requestPermission] = useCameraPermissions();
  const device = useCameraDevice("back");

  const [modelUri, setModelUri] = useState<string | null>(null);
  const [session, setSession] = useState<InferenceSession | null>(null);

  useEffect(() => {
    getModelAsset().then((modelUri) => {
      setModelUri(modelUri);
    });
  }, []);

  useEffect(() => {
    if (modelUri) {
      createSession(modelUri).then((s) => {
        setSession(s);
      });
    }
  }, [modelUri]);

  const isRunning = useSharedValue(true);

  const paint = Skia.Paint();
  paint.setColor(Skia.Color("red"));
  paint.setStyle(PaintStyle.Stroke); // Set to stroke mode
  paint.setStrokeWidth(4); // Adjust as needed

  const frameProcessor = useSkiaFrameProcessor(
    (frame: DrawableFrame) => {
      "worklet";

      if (!isRunning.value) {
        // console.log("Not running");
        return;
      } else {
        // isRunning.value = false;
      }

      runAsync(frame, () => {
        "worklet";

        if (!modelUri) {
          return;
        }

        if (session){   
          console.log("model is loaded");

          runSessionJs(session);

          isRunning.value = false;
        }
      });

      frame.render();
    },
    [session, runSessionJs]
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!device) {
    return (
      <View>
        <Text>No camera found</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Request Permission" />
        <Button onPress={openSettings} title="Open Settings" />
      </View>
    );
  }

  async function openSettings() {
    await Linking.openSettings();
  }

  // console.log(device.formats);

  const format = device.formats.find(
    (format) => format.videoWidth === 1280 && format.videoHeight === 720
  );

  // console.log(format);

  return (
    <View style={styles.container}>
      <Text>{name.value}</Text>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive
        format={format}
        pixelFormat="yuv"
        // fps={2}
        enableFpsGraph={true}
        frameProcessor={frameProcessor}
      ></Camera>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "gray",
  },
});


