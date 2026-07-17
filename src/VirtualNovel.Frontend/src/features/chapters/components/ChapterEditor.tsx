import { Editor } from "@tinymce/tinymce-react";
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/skins/ui/oxide/skin.css";

import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";

type ChapterEditorProps = {
    value: string;
    onChange: (html: string) => void;
};

export default function ChapterEditor({
                                          value ,
                                          onChange,
                                      }: ChapterEditorProps) {
    return (
        <Editor
            licenseKey="gpl"
            value={value}
            onEditorChange={onChange}
            init={{
                height: 520,
                menubar: false,
                skin: false,
                content_css: false,

                plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "table",
                    "help",
                    "wordcount",
                ],

                toolbar:
                    "undo redo | blocks | bold italic underline strikethrough | " +
                    "alignleft aligncenter alignright justify | " +
                    "bullist numlist blockquote | link image table | " +
                    "removeformat preview fullscreen code",

                content_style: `
                    body {
                        background: #1c0d2d;
                        color: #ffffff;
                        font-family: Arial, sans-serif;
                        font-size: 18px;
                        line-height: 2;
                        padding: 20px;
                    }

                    blockquote {
                        border-left: 4px solid #ab20c5;
                        margin-left: 0;
                        padding-left: 16px;
                    }
                `,
            }}
        />
    );
}