import { StyleSheet } from "react-native";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import {
  VStack,
  Input,
  Flex,
  Center,
  Modal,
  Heading,
  View,
  ScrollView,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Button, Box } from "native-base";
import { RootTabScreenProps } from "../types";
import { getSequence, deleteSequence } from "../api/storage";
import { useIsFocused } from "@react-navigation/native";
import { secsToTime } from "../lib/time";
import Step from "../components/Step";
import ConfirmDialog from "../components/ConfirmDialog";
import { step } from "../types";
import {
  play321BipSound,
  playEndBipSound,
  playStartBipSound,
  loadSounds,
  unloadSounds,
} from "../api/sounds";

export default function Create({
  navigation,
  route,
}: RootTabScreenProps<"Run">) {
  const isFocused = useIsFocused(); //forces re-fetch when comming back to this page

  const [steps, setSteps] = useState<Array<step>>([]);
  const { sequenceName, sequenceId } = route.params;
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    loadSounds();
    return () => unloadSounds();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      stopTaskTimer(); // cleanup the interval when leaving the screen
    });

    return unsubscribe;
  }, [navigation]);

  function runTaskTimer() {
    activateKeepAwake();
    playStartBipSound();
    const interval = setInterval(() => {
      setCurrentTime((currentTime: number) => {
        if (currentTime <= 0) {
          setCurrentStepIndex((currentStepIndex: number) => {
            if (currentStepIndex === steps.length - 1) {
              // last element
              playEndBipSound();
              stopTaskTimer();
              return currentStepIndex;
            } else {
              playStartBipSound();
              setCurrentTime(steps[currentStepIndex + 1].time);
              return currentStepIndex + 1;
            }
          });
        }
        if (currentTime < 4) {
          play321BipSound();
        }
        return currentTime - 1;
      }); // count every sec
    }, 1000);
    setRunning(true);

    intervalRef.current = interval;
  }

  function stopTaskTimer() {
    deactivateKeepAwake();

    if (intervalRef.current) {
      setRunning(false);
      clearInterval(intervalRef.current);
    }
  }

  function deleteTheSequence(id: string) {
    deleteSequence(id);
    navigation.navigate("Home");
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
          <VStack space={3} alignItems="center">
            {steps.slice(currentStepIndex + 1).map(({ name, time }) => (
              <Step name={name} time={time} />
            ))}
          </VStack>
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
    <Center style={{ flex: 1 }}>
      <View>
        <Flex direction="row-reverse">
          <Button
            marginLeft="2"
            colorScheme="danger"
            onPress={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
          {/* <Button>Edit</Button>  for later */}
        </Flex>
        <Heading size="xl" w="64" marginTop="4" marginBottom="6">
          {sequenceName}
        </Heading>
      </View>
      <View style={{ flex: 0.9 }}>
        <VStack space={3}>
          <Center
            key="head"
            bg={
              steps[currentStepIndex].name === "Pause"
                ? "muted.500"
                : "tertiary.500"
            }
            w="64"
            h="40"
            rounded="md"
            shadow={3}
            alignItems="center"
          >
            <Heading color="white" marginTop="2" marginBottom="6">
              {steps[currentStepIndex].name}
            </Heading>
            <Heading color="white" size="3xl" paddingTop="0">
              {secsToTime(currentTime)}
            </Heading>
          </Center>
          {renderUpNext()}
        </VStack>
      </View>
      <Button
        style={{ flex: 0.07 }}
        w="64"
        h="10"
        marginY="4"
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
      <ConfirmDialog
        title="Are you sure?"
        content="This will delete this sequence, there is no way of getting it back"
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => deleteTheSequence(sequenceId)}
      />
    </Center>
  );
}
