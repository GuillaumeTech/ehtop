import { StyleSheet } from "react-native";

import {
  Input,
  Text,
  Modal,
  Flex,
} from "native-base";
import React, { useRef } from "react";
import { Button } from "native-base";
import { Formik } from "formik";

type stepEntry = { name: string; seconds: string; minutes: string };

export default function TimeModal(props: {
  noNameEntry?: boolean;
  title: String;
  isOpen: boolean | undefined;
  onClose: Function;
  onSubmit: Function;
}) {
  const { onSubmit, title, noNameEntry, isOpen, onClose } = props;
  const secondsRef = useRef();

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Formik
          initialValues={{ name: "", seconds: "", minutes: "" }}
          onSubmit={(values) => onSubmit(fillEmptyFields(values))}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <Modal.Body>
                {!noNameEntry && (
                  <Input
                    placeholder="Name of the step"
                    marginX="4"
                    marginBottom="2"
                    size="xl"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />
                )}
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
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    isDisabled={
                      noNameEntry
                        ? !(values.minutes || values.seconds)
                        : !(values.name && (values.minutes || values.seconds))
                      // we want name + minutre or seconds for it to be valid
                    }
                    onPress={() => {
                      handleSubmit();
                      onClose();
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
