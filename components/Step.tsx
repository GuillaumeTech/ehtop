import { Button, Flex, Text, Heading, View, ScrollView } from "native-base";
import React from "react";
import { secsToTime } from "../lib/time";

export default function Step({
  name,
  time,
  key,
  bg,
  onPress = () => {},
}: {
  name: string;
  time: number;
  key?: string;
  bg?: string;
  onPress?: Function;
}) {
  return (
    <Button
      key={key}
      w="64"
      bg={name === "Pause" ? "muted.200" : "info.200"}
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
        <Text>{name}</Text>
        <Text>{secsToTime(time)}</Text>
      </Flex>
    </Button>
  );
}
