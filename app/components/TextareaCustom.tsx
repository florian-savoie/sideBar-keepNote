"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import {
    Bold, Italic, UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
    Highlighter, LinkIcon, List, ListOrdered, Heading1, Heading2, Code, Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface TextareaCustomProps {
    value: string;
    name: string;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextareaCustom({ value, onChange, name, id }: TextareaCustomProps) {
    const [content, setContent] = useState(value);
    const [linkUrl, setLinkUrl] = useState("");
    const [highlightColor, setHighlightColor] = useState("#ffff00");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TextStyle,
            Color,
            Underline,
            Link.configure({ openOnClick: false }),
            CodeBlock.configure({ HTMLAttributes: { class: "code-block" } }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const newContent = editor.getHTML();
            setContent(newContent);
            onChange({ target: { name, value: newContent } } as React.ChangeEvent<HTMLTextAreaElement>);
        },
        // Pas de handleKeyDown ici, on laisse Tiptap gérer Enter
    });

    const setLink = () => {
        if (!linkUrl) return;
        if (editor?.isActive("link")) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
        }
        setLinkUrl("");
    };

    const addEmoji = (emoji: any) => {
        editor?.chain().focus().insertContent(emoji.native).run();
    };
    const stopeventprevent = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents the event from propagating (bubbling) to parent elements
        e.preventDefault();   // Optionally prevents the default action associated with the event
    };
    if (!editor) return null;

    return (
        <div className="border rounded-md w-[80%]" onClick={stopeventprevent}>
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
                {/* Gras */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-muted" : ""}
                >
                    <Bold className="w-4 h-4" />
                </Button>

                {/* Italique */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-muted" : ""}
                >
                    <Italic className="w-4 h-4" />
                </Button>

                {/* Souligné */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive("underline") ? "bg-muted" : ""}
                >
                    <UnderlineIcon className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Titre 1 */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
                >
                    <Heading1 className="w-4 h-4" />
                </Button>

                {/* Titre 2 */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
                >
                    <Heading2 className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Liste à puces */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-muted" : ""}
                >
                    <List className="w-4 h-4" />
                </Button>

                {/* Liste numérotée */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "bg-muted" : ""}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Alignement à gauche */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""}
                >
                    <AlignLeft className="w-4 h-4" />
                </Button>

                {/* Alignement au centre */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""}
                >
                    <AlignCenter className="w-4 h-4" />
                </Button>

                {/* Alignement à droite */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""}
                >
                    <AlignRight className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Surlignage avec couleur personnalisée */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className={editor.isActive("highlight") ? "bg-muted" : ""}>
                            <Highlighter className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="highlight-color">Couleur de surlignement</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="highlight-color"
                                        type="color"
                                        value={highlightColor}
                                        onChange={(e) => setHighlightColor(e.target.value)}
                                        className="w-12 h-8 p-1"
                                    />
                                    <Button onClick={() => editor.chain().focus().toggleHighlight({ color: highlightColor }).run()}>
                                        Appliquer
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Bloc de code */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive("codeBlock") ? "bg-muted" : ""}
                >
                    <Code className="w-4 h-4" />
                </Button>

                {/* Liens */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className={editor.isActive("link") ? "bg-muted" : ""}>
                            <LinkIcon className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="link">URL du lien</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="link"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                    <Button onClick={setLink}>Ajouter</Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Emoji Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Smile className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Picker data={data} onEmojiSelect={addEmoji} theme="light" previewPosition="none" skinTonePosition="none" />
                    </PopoverContent>
                </Popover>

                {/* Couleurs de texte */}
                <div className="flex items-center ml-auto">
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().setColor("#f44336").run()}
                            className="w-6 h-6 p-0 rounded-full"
                            style={{ backgroundColor: "#f44336" }}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().setColor("#2196f3").run()}
                            className="w-6 h-6 p-0 rounded-full"
                            style={{ backgroundColor: "#2196f3" }}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().setColor("#4caf50").run()}
                            className="w-6 h-6 p-0 rounded-full"
                            style={{ backgroundColor: "#4caf50" }}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().setColor("#ff9800").run()}
                            className="w-6 h-6 p-0 rounded-full"
                            style={{ backgroundColor: "#ff9800" }}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().setColor("#9c27b0").run()}
                            className="w-6 h-6 p-0 rounded-full"
                            style={{ backgroundColor: "#9c27b0" }}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().unsetColor().run()}
                            className="w-6 h-6 p-0 rounded-full border border-gray-300"
                        >
                            <span className="sr-only">Réinitialiser la couleur</span>
                        </Button>
                    </div>
                </div>
            </div>

            <EditorContent
                editor={editor}
                className="p-4 min-h-[200px] prose max-w-none"
                data-name={name}
                id={id}
            />

            
        </div>
    );
}