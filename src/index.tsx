import {
  Grid,
  GridItem,
  Box,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Badge,
  Select,
} from "@chakra-ui/react";
import { Editor, Monaco } from "./components/monaco";
import { useEffect, useRef, useState } from "react";
import { formatJSONWithPrettier } from "./formatter";
import * as E from "fp-ts/Either";

export const Page = () => {
  const ref = useRef<HTMLDivElement>(null);
  const formattedCodeRef = useRef<Editor | null>(null);

  const [code, setCode] = useState<string | null>(null);
  const [formattedCode, setFormattedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ref.current?.addEventListener("paste", (e) => {
      const clipboardText = e.clipboardData;
      if (!clipboardText) return;
      const pastedText = clipboardText.getData("Text");
      setFormattedCodeOrError(pastedText);
    });
  }, []);

  const setFormattedCodeOrError = (code?: string) => {
    if (!code) {
      return;
    }

    try {
      const formatted = formatJSONWithPrettier(code);
      if (E.isLeft(formatted)) {
        setError(formatted.left.message);
        return;
      }
      setFormattedCode(formatted.right);
      setError(null);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  return (
    <Box>
      <Grid p={4} gap={4} templateColumns="repeat(2, 1fr)">
        <GridItem>
          <Box width={"full"} pl={4}>
            <Box
              mb={4}
              display="flex"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Text fontSize={"xl"}>JSON to be FORMATTED</Text>
              <Box flexDirection={"row"} display={"flex"}>
                <Select width={"140px"}>
                  <option value="option1" selected>
                    JSON
                  </option>
                </Select>

                <Button
                  ml={6}
                  variant={"solid"}
                  onClick={() => {
                    setFormattedCodeOrError(code ?? undefined);
                  }}
                >
                  Format
                </Button>
              </Box>
            </Box>
            <div ref={ref}>
              <Monaco
                value={code ?? undefined}
                onChange={(value) => {
                  if (!value) return;
                  setCode(value);
                }}
              />
            </div>
          </Box>
        </GridItem>
        <GridItem>
          <Box width={"full"} pr={4}>
            <Box mb={4} display="flex" justifyContent="space-between">
              <Text fontSize={"xl"}>Formatted JSON</Text>
              <Box display="flex">
                <Button
                  borderRadius={0}
                  size="sm"
                  onClick={() => {
                    if (!formattedCodeRef.current) return;
                    formattedCodeRef.current.getAction("editor.foldAll")?.run();
                  }}
                >
                  Fold All
                </Button>
                <Button
                  borderRadius={0}
                  size="sm"
                  onClick={() => {
                    if (!formattedCodeRef.current) return;
                    formattedCodeRef.current
                      .getAction("editor.unfoldAll")
                      ?.run();
                  }}
                >
                  Un-Fold All
                </Button>
              </Box>
            </Box>
            <Monaco ref={formattedCodeRef} value={formattedCode ?? undefined} />
          </Box>
        </GridItem>
      </Grid>
      <Box
        px={8}
        borderTop={1}
        borderColor={"gray.400"}
        borderTopStyle={"solid"}
      >
        <Tabs position="relative" variant="unstyled">
          <TabList>
            <Tab>
              Error
              {error ? (
                <Badge ml={2} colorScheme="red">
                  1
                </Badge>
              ) : null}
            </Tab>
            <Tab>TBD</Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          />
          <TabPanels
            style={{
              height: "15vh",
            }}
            overflow={"auto"}
          >
            <TabPanel>
              {!error && (
                <Text fontSize={"sm"} color={"green"}>
                  No errors
                </Text>
              )}
              {error && (
                <Text fontSize={"sm"} color={"red"}>
                  {error}
                </Text>
              )}
            </TabPanel>
            <TabPanel>Hmm ... what do you think we should put here</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};
