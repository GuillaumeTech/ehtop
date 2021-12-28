import { StyleSheet } from "react-native";

import {
  VStack,
  Input,
  Text,
  Center,
  Modal,
  Heading,
  View,
  ScrollView,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Button, Box } from "native-base";
import { RootTabScreenProps } from "../types";
import { Formik } from "formik";
import { getSequence } from "../api/storage";
import { useIsFocused } from "@react-navigation/native";

export default function Create({
  navigation,
  route,
}: RootTabScreenProps<"Run">) {
  const isFocused = useIsFocused(); //forces re-fetch when comming back to this page

  const [steps, setSteps] = useState<Array<any>>([]);
  const { sequenceName, sequenceId } = route.params;
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef<any>(null);
  const isAtLastElement = currentStepIndex === steps.length - 1;
  useEffect(() => {
    async function retreiveSequence() {
      const seq = await getSequence(sequenceId);
      setSteps(seq);
      setCurrentTime(seq[0].time);
      setLoading(false);
    }
    retreiveSequence();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      stopTaskTimer(); // cleanup the interval when leaving the screen
    });

    return unsubscribe;
  }, [navigation]);

  function runTaskTimer() {
    const interval = setInterval(() => {
      console.log("HOH");
      setCurrentTime((currentTime: number) => {
        if (currentTime <= 0) {
          setCurrentStepIndex((currentStepIndex: number) => {
            if (currentStepIndex === steps.length - 1) {
              // last element
              stopTaskTimer();
              return currentStepIndex;
            } else {
              setCurrentTime(steps[currentStepIndex + 1].time);
              return currentStepIndex + 1;
            }
          });
        }
        return currentTime - 1;
      }); // count every sec
    }, 1000);
    setRunning(true);

    intervalRef.current = interval;
  }

  function stopTaskTimer() {
    if (intervalRef.current) {
      setRunning(false);
      clearInterval(intervalRef.current);
    }
  }

  function renderEndOfSequence() {
    return (
      <View>
        <Center>
          <Heading size="xl" w="64" marginTop="45" marginBottom="15">
            {sequenceName} is completed !
          </Heading>

          <Button
            w="64"
            h="10"
            marginTop="3"
            onPress={() => {
              navigation.navigate("Home");
            }}
            rounded="md"
            variant="outline"
            shadow={2}
          >
            Go Back
          </Button>
        </Center>
      </View>
    );
  }

  function renderUpNext() {
    return (
      !isAtLastElement && (
        <>
          <Heading w="64" marginTop="4" marginBottom="6">
            Up next
          </Heading>
          {steps.slice(currentStepIndex + 1).map((step) => (
            <Box
              key={`${step.step_name.replace(" ", "_")}_${step.time}`}
              w="64"
              rounded="md"
              shadow={3}
            >{`${step.step_name} - ${step.time}`}</Box>
          ))}
        </>
      )
    );
  }

  if (loading) {
    return <View></View>;
  }

  // the task is finsihed screen
  if (isAtLastElement && currentTime <= 0) {
    return renderEndOfSequence();
  }

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Center>
          <Heading size="xl" w="64" marginTop="4" marginBottom="6">
            {sequenceName}
          </Heading>
        </Center>
      </View>
      <View>
        <VStack space={3} alignItems="center">
          <Box
            key="head"
            bg="primary.500"
            w="64"
            h="40"
            rounded="md"
            shadow={3}
          >
            <Heading w="64" marginTop="4" marginBottom="6">
              {steps[currentStepIndex].step_name}
            </Heading>
            <Heading w="64" marginTop="4" marginBottom="6">
              {currentTime}
            </Heading>
          </Box>
          {renderUpNext()}
        </VStack>
      </View>
      <View>
        <Heading textAlign="center" mb="10">
          <Button
            w="64"
            h="10"
            marginTop="3"
            onPress={() => {
              if (!running) {
                runTaskTimer();
                return;
              }
              stopTaskTimer();
            }}
            rounded="md"
            shadow={3}
          >
            {!running ? "Start" : "Stop"}
          </Button>
        </Heading>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
