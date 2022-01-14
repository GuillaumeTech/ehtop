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
import React, { useState, useRef } from "react";
import { Button } from "native-base";
import { RootTabScreenProps, step } from "../types";
import { Formik, setNestedObjectValues } from "formik";
import { addSequence } from "../api/storage";
import { secsToTime, timetoSec } from "../lib/time";
import Step from "../components/Step";
type stepEntry = { name: string; seconds: string; minutes: string };

export default function Create({ navigation }: RootTabScreenProps<"Create">) {
  const [steps, setSteps] = useState<Array<step>>([]);
  const [showModal, setShowModal] = useState<boolean | undefined>(false);
  const [title, setTitle] = useState<string>("");
  const secondsRef = useRef();
  const onAddStep = ({ minutes, seconds, name }: stepEntry) => {
    const time = timetoSec(minutes, seconds);
    setSteps([...steps, { name, time }]);
  };

  const saveSequence = () => {
    addSequence(title, steps);
  };

  const fillEmptyFields = (stepInfo: stepEntry) => {
    const properStepInfo = stepInfo;
    if (stepInfo.minutes === "") {
      properStepInfo.minutes = "00";
    }
    if (stepInfo.seconds === "") {
      properStepInfo.seconds = "00";
    }
    return properStepInfo;
  };

  const renderModal = () => (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Add a step</Modal.Header>
        <Formik
          initialValues={{ name: "", seconds: "", minutes: "" }}
          onSubmit={(values) => onAddStep(fillEmptyFields(values))}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <Modal.Body>
                <Input
                  placeholder="Name of the step"
                  marginX="4"
                  marginBottom="2"
                  size="xl"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
                <Flex direction="row">
                  <Input
                    returnKeyType="next"
                    onSubmitEditing={() => {}}
                    marginY="2"
                    marginLeft="4"
                    width="45%"
                    size="2xl"
                    marginBottom="5"
                    placeholder="mm"
                    keyboardType="numeric"
                    maxLength={2}
                    onChangeText={(text) => {
                      if (text === "") handleChange("minutes")(text);
                      else if (/^[0-9]+$/.test(text)) {
                        handleChange("minutes")(text);
                      }
                      if (text.length == 2) secondsRef.current.focus();
                    }}
                    onBlur={handleBlur("minutes")}
                    value={values.minutes}
                    style={styles.timeEntry}
                    textAlign="right"
                  />
                  <Text fontSize="65">:</Text>
                  <Input
                    ref={secondsRef}
                    marginY="2"
                    size="2xl"
                    width="45%"
                    marginBottom="5"
                    placeholder="ss"
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      if (text === "") handleChange("seconds")(text);
                      else if (/^[0-9]+$/.test(text)) {
                        handleChange("seconds")(text);
                      }
                    }}
                    onBlur={handleBlur("seconds")}
                    value={values.seconds}
                    style={styles.timeEntry}
                    maxLength={2}
                  />
                </Flex>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    isDisabled={
                      // we want name + minutre or seconds for it to be valid
                      !(values.name && (values.minutes || values.seconds))
                    }
                    onPress={() => {
                      handleSubmit();
                      setShowModal(false);
                    }}
                  >
                    Save
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  );

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
          {steps.map(({ name, time }) => (
            <Step name={name} time={time} />
          ))}
        </VStack>
      </ScrollView>
      <View style={{ flex: 0.3 }}>
      {/* <Button
          w="64"
          h="10"
          marginTop="3"
          onPress={() => setShowModal(true)}
          rounded="md"
          shadow={3}
        >
          pause inbetween 
        </Button>*/}
        <Button
          w="64"
          h="10"
          marginTop="3"
          onPress={() => setShowModal(true)}
          rounded="md"
          shadow={3}
        >
          Add step
        </Button>
        <Button
          w="64"
          h="10"
          marginTop="3"
          colorScheme="secondary"
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
      </View>
      {renderModal()}
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
