"use client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import FormComponent from "../components/Forms/FormComponent";

export default function TestingsPage() {
  return (
    <Grid columns="1" m={"3"} gap={"2"} justify={"center"} p={"3"}>
      {/* <RadialChart value={70} maxValue={100} units="%" /> */}
      <FormComponent />
    </Grid>

    // </Flex>
  );
}
