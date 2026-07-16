import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, Button, ButtonGroup } from "@mui/material";

type ChapterEditorProps = {
    value?: string;
    onChange: (html: string) => void;
};

export default function ChapterEditor({
                                          value = "",
                                          onChange,
                                      }: ChapterEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <Box>
            <ButtonGroup size="small" sx={{ mb: 1 }}>
                <Button
                    variant={editor.isActive("bold") ? "contained" : "outlined"}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    B
                </Button>

                <Button
                    variant={editor.isActive("italic") ? "contained" : "outlined"}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    I
                </Button>

                <Button
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    List
                </Button>

                <Button
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                >
                    Quote
                </Button>
            </ButtonGroup>

            <Box
                sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    minHeight: 400,
                    p: 2,

                    "& .tiptap": {
                        minHeight: 360,
                        outline: "none",
                    },

                    "& .tiptap p": {
                        my: 1.5,
                    },
                }}
            >
                <EditorContent editor={editor} />
            </Box>
        </Box>
    );
}