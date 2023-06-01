import {
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
  SimpleGrid,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { Editor, Monaco } from "./components/monaco";
import { useEffect, useRef, useState } from "react";
import { formatJSONWithPrettier } from "./formatter";
import * as E from "fp-ts/Either";
import { ReactComponent as CopyIcon } from "./assets/icons/copyIcon.svg";
import JSONtoTS from "json-to-ts";

export const Page = () => {
  const ref = useRef<HTMLDivElement>(null);
  const formattedCodeRef = useRef<Editor | null>(null);

  const [code, setCode] = useState<string | null>(null);
  const [formattedCode, setFormattedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
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
      <SimpleGrid p={2} columns={2} spacing={10}>
        <GridItem>
          <Box width={"full"} pl={4}>
            <Box
              mb={4}
              display="flex"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box display={"flex"} alignItems="center" flexDirection={"row"}>
                <img src="./public/logo.svg" alt="logo" width={50} />
              </Box>
              <Box flexDirection={"row"} display={"flex"}>
                <Select width={"140px"}>
                  <option value="option1" selected>
                    JSON
                  </option>
                </Select>

                <Button
                  size={"sm"}
                  borderRadius={2}
                  colorScheme={"blue"}
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
                  variant="outline"
                  ml={1}
                  borderRadius={2}
                  leftIcon={<CopyIcon width={18} height={18} />}
                  isDisabled={!formattedCode}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    if (!formattedCode) return;
                    const types = JSONtoTS(JSON.parse(formattedCode)).join(
                      "\n"
                    );
                    toast({
                      title: "Copied!",
                      description: "TS types copied to clipboard",
                      status: "success",
                      colorScheme: "blue",
                      duration: 3000,
                      position: "top",
                      isClosable: true,
                    });
                    navigator.clipboard.writeText(types);
                  }}
                >
                  Copy TS Type
                </Button>
                <Button
                  borderRadius={2}
                  variant="outline"
                  ml={1}
                  isDisabled={!formattedCode}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    if (!formattedCodeRef.current) return;
                    formattedCodeRef.current.getAction("editor.foldAll")?.run();
                  }}
                >
                  Fold All
                </Button>
                <Button
                  borderRadius={2}
                  variant="outline"
                  ml={1}
                  colorScheme="blue"
                  isDisabled={!formattedCode}
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
            <Monaco
              ref={formattedCodeRef}
              onChange={(value) => {
                setFormattedCode(value ?? null);
              }}
              value={formattedCode ?? undefined}
            />
          </Box>
        </GridItem>
      </SimpleGrid>
      <Divider orientation="horizontal" />
      <Box px={8}>
        <Tabs size={"sm"} position="relative" variant="unstyled">
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
            <TabPanel px={0} py={2}>
              {!error && <Text fontSize={"sm"}>No errors</Text>}
              {error && (
                <Text fontSize={"sm"} color={"red"}>
                  {error}
                </Text>
              )}
            </TabPanel>
            <TabPanel px={0} py={2}>
              TBD
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};
