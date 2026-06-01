import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Navbar, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { eightBitLanguage } from "../service/eightBitLanguage";
import { eightBitIndentation } from "../service/eightBitIndent";
import { indentOnInput } from "@codemirror/language";
import { eightBitEnterIndent } from "../service/eightBitEnterIndent";
import { eightBitFormatKeymap } from "../service/eightBitFormat";
import { oneDark } from "@codemirror/theme-one-dark";

type IFormInput = {
    sourceCode: string
}

type ExecuteSnippetData = {
    executeSnippet: {
        stdout: string | null;
    };
};

type ExecuteSnippetVars = {
    input: {
        title: string;
        sourceCode: string;
    };
};


type Props = {
    value: string;
    onChange: (value: string) => void;
    extensions?: Extension;
};

export function CodeMirrorField({ value, onChange, extensions = [] }: Props) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView | null>(null);

    const dynamic = useMemo(() => new Compartment(), []);

    useEffect(() => {
        if (!hostRef.current)
            return;

        const state = EditorState.create({
            doc: value,
            extensions: [
                basicSetup,
                dynamic.of(extensions),
                EditorView.updateListener.of((update) => {
                    if (!update.docChanged) return;
                    onChange(update.state.doc.toString());
                }),
                EditorView.theme({
                    "&": { border: "1px solid #dee2e6", borderRadius: "0.375rem" },
                    ".cm-content": { minHeight: "200px" },
                    ".cm-scroller": { fontFamily: "monospace" },
                }),
            ],
        });

        const view = new EditorView({ state, parent: hostRef.current });
        viewRef.current = view;

        return () => view.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // update editor doc when RHF changes it (reset/template/etc.)
    useEffect(() => {
        const view = viewRef.current;
        if (!view)
            return;

        const current = view.state.doc.toString();
        if (current === value)
            return;

        view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: value },
        });
    }, [value]);

    // reconfigure extensions when props change (THIS fixes dark gutters)
    useEffect(() => {
        const view = viewRef.current;
        if (!view)
            return;

        view.dispatch({
            effects: dynamic.reconfigure(extensions),
        });
    }, [dynamic, extensions]);

    return <div ref={hostRef} />;
}

export default function Home() {

    const EXECUTE_SNIPPET = useMemo(() => gql`mutation ExecuteSnippet($input: CodeSnippetInput!) {
        executeSnippet(input: $input) {
                stdout
            }
        }`, []);

    const [executeSnippet, { data, loading, error }] = useMutation<ExecuteSnippetData, ExecuteSnippetVars>(EXECUTE_SNIPPET);

    const [darkMode, setDarkMode] = useState(false);

    const { handleSubmit, control } = useForm<IFormInput>({
        defaultValues: { sourceCode: "" },
    });

    const onSubmit: SubmitHandler<IFormInput> = async ({ sourceCode }) => {
        await executeSnippet({
            variables: {
                input: {
                    title: "",
                    sourceCode: sourceCode
                }
            }
        });
    }

    return (
        <Container fluid className={darkMode ? "bg-dark text-light min-vh-100" : "min-vh-100"}>
            <Navbar sticky="top"
                bg={darkMode ? "dark" : "light"}
                data-bs-theme={darkMode ? "dark" : "light"}
                className="mb-2 border-bottom"
                style={{ zIndex: 1030, backdropFilter: "blur(8px)", backgroundColor: darkMode ? "rgba(33,37,41,0.85)" : "rgba(248,249,250,0.85)", }}>
                <Container fluid>
                    <Navbar.Brand className="fw-bold">8 Bit Language Playground</Navbar.Brand>
                    <OverlayTrigger
                        placement="left"
                        overlay={
                            <Tooltip id="theme-tip">
                                {darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            </Tooltip>
                        }
                    >
                        <Button
                            variant={darkMode ? "outline-light" : "outline-dark"}
                            onClick={() => setDarkMode((v) => !v)}
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            className="d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40, padding: 0 }}
                        >
                            <span style={{ fontSize: 18, lineHeight: 1 }}>
                                {darkMode ? "☀️" : "🌙"}
                            </span>
                        </Button>
                    </OverlayTrigger>
                </Container>
            </Navbar>
            <Row>
                <Col>
                    <Row>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group>
                                <Form.Group className="mb-3">
                                    <Controller
                                        name="sourceCode"
                                        control={control}
                                        rules={{ required: "Source code is required" }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <CodeMirrorField
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    extensions={[
                                                        keymap.of([...closeBracketsKeymap, indentWithTab]),
                                                        indentOnInput(),
                                                        closeBrackets(),
                                                        eightBitEnterIndent,
                                                        eightBitLanguage,
                                                        eightBitIndentation,
                                                        eightBitFormatKeymap,
                                                        ...(darkMode ? [oneDark] : []),
                                                    ]}
                                                />
                                                {fieldState.error && <div>{fieldState.error.message}</div>}
                                            </>
                                        )}
                                    />
                                </Form.Group>
                            </Form.Group>
                            <Button type="submit" disabled={loading}>Run</Button>
                        </Form>
                    </Row>
                    <hr />
                    <Row>
                        {error && <div>Error: {error.message}</div>}
                        <Card body bg={darkMode ? "dark" : "light"} text={darkMode ? "light" : "dark"}>
                            {loading ? "…" : (data?.executeSnippet.stdout ?? "")}
                        </Card>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <footer style={{ textAlign: "center" }}>Inspired and based by the Simple 8-bit Assembler Simulator by Marco Schweighauser (2015)</footer>
                </Col>
            </Row>
        </Container>
    );
}