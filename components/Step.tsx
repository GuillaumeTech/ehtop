import { Button, Flex, Text, Heading, View, ScrollView } from "native-base";
import React from "react";
import { secsToTime } from "../lib/time";

export default function Step({ name, time, onPress = () => {} }) {
  return (
    <Button
      key={`${name}_${time}`}
      w="64"
      bg="info.200"
      rounded="md"
      shadow={3}
      onPress={() => onPress()}
    >
      <Flex
        w="230"
        alignContent="center"
        justifyContent="space-between"
        direction="row"
      >
        <Text >{name}</Text>
        <Text >{secsToTime(time)}</Text>
      </Flex>
    </Button>
  );
}
