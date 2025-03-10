import { Asset } from "expo-asset";
import * as ort from "onnxruntime-react-native";
import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { Text, View } from "react-native";

async function loadSimpleModel() {
  try {
    const assets = await Asset.loadAsync(
      require("../assets/simple-model.onnx")
    );

    const modelUri = assets[0].localUri;

    if (!modelUri) {
      throw new Error(`failed to get model URI: ${assets[0]}`);
    } else {
      // load model from model url path

      const myModel = await ort.InferenceSession.create(modelUri, {
        logSeverityLevel: 0,
        enableProfiling: true,
        logId: "testlog",
        logVerbosityLevel: 0,
        profileFilePrefix: "Logging",
      });
      console.log("model loaded successfully");
      console.log(
        `input names: ${myModel.inputNames}, output names: ${myModel.outputNames}`
      );

      return myModel;
    }
  } catch (e) {
    console.log("failed to load model", `${e}`);
    throw e;
  }
}


function generateFpArray(length: number): Float32Array {
  const array = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    // Here we're using random values between 0 and 1.
    array[i] = Math.random();
  }
  return array;
}

function simpleTest() {
  loadSimpleModel().then((model: InferenceSession) => {
    console.log(`loaded model.`);
    console.log(`model: ${JSON.stringify(model)}`);

    // prepare inputs. a tensor need its corresponding TypedArray as data
    const dataA = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const dataB = Float32Array.from([
      10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120,
    ]);
    const tensorA = new ort.Tensor("float32", dataA, [3, 4]);
    const tensorB = new ort.Tensor("float32", dataB, [4, 3]);

    // prepare feeds. use model input names as keys.
    const feeds = { a: tensorA, b: tensorB };
    console.log(`feeds: ${feeds}`);

    model.run(feeds).then((fetches: any) => {
      // Run inference session
      console.log(`model ran.`);

      // read from results
      const dataC = fetches.c.data;
      console.log(`data of result tensor 'c': ${dataC}`);
    });

    model.endProfiling();
    model.release();
  });

  return (
    <View>
      <Text>Hello Simple.</Text>
    </View>
  );
}

export default function main() {
  return simpleTest();
}
