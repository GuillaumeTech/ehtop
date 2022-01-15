import { StyleSheet } from "react-native";

import {
  VStack,
  Input,
  Center,
  Text,
  Modal,
  Flex,
  View,
  ScrollView,
} from "native-base";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "native-base";
import { RootTabScreenProps, step } from "../types";
import { Formik, setNestedObjectValues } from "formik";
import { addSequence } from "../api/storage";
import { secsToTime, timetoSec } from "../lib/time";
import Step from "../components/Step";
import TimeModal from "../components/TimeModal";

type stepEntry = { name: string; seconds: string; minutes: string };

export default function Create({ navigation }: RootTabScreenProps<"Create">) {
  const [steps, setSteps] = useState<Array<step>>([]);
  const [pauseTime, setPauseTime] = useState<number>(0);

  const [showStepModal, setShowStepModal] = useState<boolean | undefined>(
    false
  );
  const [showPauseModal, setShowPauseModal] = useState<boolean | undefined>(
    false
  );

  const [title, setTitle] = useState<string>("");

  const onAddStep = ({ minutes, seconds, name }: stepEntry) => {
    const time = timetoSec(minutes, seconds);
    setSteps([...steps, { name, time }]);
  };

  const onSetPause = ({ minutes, seconds }: stepEntry) => {
    const time = timetoSec(minutes, seconds);
    setPauseTime(time);
  };

  const saveSequence = () => {
    let properSteps = steps;
    if (pauseTime) {
      const pauseStep = { name: "Pause", time: pauseTime };
      properSteps = steps.reduce((prev, step, i) => {
        prev.push(step);
        if (pauseTime && i < steps.length - 1) prev.push(pauseStep);
        return prev
      }, []);
    }
    addSequence(title, properSteps);
  };

  return (
    <Center style={{ flex: 1 }}>
      <Input
        size="xl"
        w="64"
        marginTop="4"
        marginBottom="6"
        placeholder="Name of the sequence"
        onChangeText={setTitle}
        value={title}
      />
      <ScrollView style={{ flex: 0.7 }}>
        <VStack space={3} alignItems="center">
          {steps.reduce((prev, { name, time }, i) => {
            prev.push(
              <Step key={`${name}_${time}_${i}`} name={name} time={time} />
            );
            if (pauseTime > 0 && i < steps.length - 1)
              prev.push(
                <Step
                  key={`pause_${i}`}
                  name={"Pause"}
                  time={pauseTime}
                />
              );
            return prev;
          }, [])}
        </VStack>
      </ScrollView>
      <View style={{ flex: 0.3 }}>
        <Button
          w="64"
          h="10"
          marginTop="3"
          onPress={() => setShowStepModal(true)}
          rounded="md"
          shadow={3}
        >
          Add step
        </Button>
        <Flex direction="row">
          <Button
            h="10"
            w="170"
            marginTop="3"
            onPress={() => setShowPauseModal(true)}
            rounded="md"
            shadow={3}
            colorScheme="secondary"
          >
            Set pause between
          </Button>
          <Button
            h="10"
            w="70"
            marginTop="3"
            colorScheme="tertiary"
            marginLeft="4"
            onPress={() => {
              saveSequence();
              navigation.navigate("Home");
            }}
            rounded="md"
            shadow={2}
            isDisabled={title === "" || steps.length === 0}
          >
            Done
          </Button>
        </Flex>
      </View>
      <TimeModal
        title="Add a step"
        isOpen={showStepModal}
        onClose={() => setShowStepModal(false)}
        onSubmit={onAddStep}
      />
      <TimeModal
        title="Set pause time between"
        isOpen={showPauseModal}
        noNameEntry
        onClose={() => setShowPauseModal(false)}
        onSubmit={onSetPause}
      />
    </Center>
  );
}

const styles = StyleSheet.create({
  timeEntry: {
    borderWidth: 0,
    fontSize: 60,
  },
  step: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
