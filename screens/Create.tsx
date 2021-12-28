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
import React, { useState } from "react";
import { Button } from "native-base";
import { RootTabScreenProps } from "../types";
import { Formik } from "formik";
import { addSequence } from "../api/storage";

type step = { title: string; time: number|string };

export default function Create({ navigation }: RootTabScreenProps<"Create">) {
  const [steps, setSteps] = useState<Array<step>>([]);
  const [showModal, setShowModal] = useState<boolean | undefined>(false);
  const [title, setTitle] = useState<string>("");

  const onAddStep = (value: step) => {
    const time  = parseInt(value.time)
    setSteps([...steps, {...value, time}]);
  };

  const saveSequence = () => {
    addSequence(title, steps);
  };

  const renderModal = () => (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Contact Us</Modal.Header>
        <Formik
          initialValues={{ title: "", time: "" }}
          onSubmit={(values) => onAddStep(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <Modal.Body>
                <Input
                  placeholder="Name of the step"
                  marginX="4"
                  marginBottom="2"
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                  value={values.title}
                />
                <Input
                  marginY="2"
                  marginX="4"
                  marginBottom="5"
                  placeholder="Time on the step"
                  keyboardType="numeric"
                  onChangeText={handleChange("time")}
                  onBlur={handleBlur("time")}
                  value={values.time}
                />
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
    <View style={{ flex: 1 }}>
      <View>
        <Center>
          <Input
            size="xl"
            w="64"
            marginTop="4"
            marginBottom="6"
            placeholder="Name of the sequence"
            onChangeText={setTitle}
            value={title}
          />
        </Center>
      </View>
      <ScrollView>
        <VStack space={3} alignItems="center">
          {steps.map((step) => (
            <Button
            key={`${step.title.replace(' ','_')}_${step.time}`}
              w="64"
              colorScheme="secondary"
              rounded="md"
              shadow={3}
            >{`${step.title} - ${step.time}`}</Button>
          ))}
        </VStack>
      </ScrollView>
      <View>
        <Heading textAlign="center" mb="10">
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
            onPress={() => {
              saveSequence();
              navigation.navigate("Home");
            }}
            rounded="md"
            variant="outline"
            shadow={2}
          >
            Done
          </Button>
        </Heading>
      </View>
      {renderModal()}
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
