"use client";

import { useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";

interface WysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

type EditorMode = "visual" | "text";

async function uploadImageBlob(blob: Blob, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob, filename);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Image upload failed");
  }
  return data.url as string;
}

function MediaIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="3" y="5" width="14" height="12" rx="1.5" />
      <circle cx="8" cy="10" r="1.5" />
      <path d="M17 9l4-2v10l-4-2V9z" />
    </svg>
  );
}

export default function WysiwygEditor({
  value,
  onChange,
  placeholder = "Start writing your article…",
}: WysiwygEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [mode, setMode] = useState<EditorMode>("visual");
  const [kitchenSink, setKitchenSink] = useState(false);
  const [uploading, setUploading] = useState(false);

  const switchToText = () => {
    const html = editorRef.current?.getContent() ?? value;
    onChange(html);
    setMode("text");
  };

  const switchToVisual = () => {
    setMode("visual");
  };

  const addMedia = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif,image/avif";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const defaultAlt = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]/g, " ");
      const alt =
        window.prompt("Image alt text (for accessibility/SEO)", defaultAlt) ??
        defaultAlt;
      setUploading(true);
      try {
        const url = await uploadImageBlob(file, file.name);
        const safeAlt = alt.replace(/"/g, "&quot;");
        const imgHtml = `<p><img src="${url}" alt="${safeAlt}" /></p>`;
        if (mode === "visual" && editorRef.current) {
          editorRef.current.insertContent(imgHtml);
          onChange(editorRef.current.getContent());
        } else {
          onChange(`${value || ""}${imgHtml}`);
        }
      } catch (e) {
        alert(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const init = useMemo(() => {
    const toolbar1 =
      "bold italic strikethrough | bullist numlist | blockquote hr | " +
      "alignleft aligncenter alignright | link unlink | wp_more | kitchen_sink";
    const toolbar2 =
      "blocks | underline alignjustify | removeformat | charmap | " +
      "outdent indent | undo redo | code";

    return {
      height: 420,
      menubar: false,
      statusbar: true,
      elementpath: true,
      branding: false,
      promotion: false,
      resize: true,
      plugins: [
        "advlist",
        "autolink",
        "charmap",
        "code",
        "image",
        "link",
        "lists",
        "media",
        "searchreplace",
        "table",
        "wordcount",
      ],
      toolbar: kitchenSink ? `${toolbar1} | ${toolbar2}` : toolbar1,
      block_formats:
        "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Preformatted=pre",
      base_url: "/tinymce",
      suffix: ".min",
      skin_url: "/tinymce/skins/ui/oxide",
      content_css: "/tinymce/skins/content/default/content.min.css",
      placeholder,
      relative_urls: false,
      remove_script_host: false,
      convert_urls: true,
      image_title: true,
      automatic_uploads: true,
      file_picker_types: "image",
      content_style: `
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #1e1e1e;
          margin: 12px 16px;
        }
        img { max-width: 100%; height: auto; }
        blockquote {
          border-left: 3px solid #ccc;
          margin: 1em 0;
          padding-left: 1em;
          color: #555;
        }
      `,
      setup: (editor: TinyMCEEditor) => {
        editor.ui.registry.addButton("wp_more", {
          tooltip: "Insert Read More tag",
          text: "⋯",
          onAction: () => {
            editor.insertContent("<!--more-->");
          },
        });
        editor.ui.registry.addToggleButton("kitchen_sink", {
          tooltip: "Toolbar Toggle",
          icon: "table-cell-properties",
          onAction: () => {
            setKitchenSink((v) => !v);
          },
          onSetup: (api) => {
            api.setActive(kitchenSink);
            return () => undefined;
          },
        });
      },
      images_upload_handler: async (blobInfo: {
        blob: () => Blob;
        filename: () => string;
      }) => {
        return uploadImageBlob(blobInfo.blob(), blobInfo.filename());
      },
      image_description: true,
      image_dimensions: false,
      file_picker_callback: (
        callback: (url: string, meta?: Record<string, string>) => void,
        _value: string,
        meta: { filetype: string },
      ) => {
        if (meta.filetype !== "image") return;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/jpeg,image/png,image/webp,image/gif,image/avif";
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          try {
            const url = await uploadImageBlob(file, file.name);
            callback(url, { title: file.name });
          } catch (e) {
            alert(e instanceof Error ? e.message : "Upload failed");
          }
        };
        input.click();
      },
    };
  }, [placeholder, kitchenSink]);

  const textWordCount = value
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="wp-classic-editor overflow-hidden border border-[#c3c4c7] bg-[#f0f0f1] shadow-sm">
      <div className="flex items-end justify-between gap-3 border-b border-[#c3c4c7] px-2 pt-2">
        <button
          type="button"
          onClick={addMedia}
          disabled={uploading}
          className="mb-2 inline-flex items-center gap-2 border border-[#c3c4c7] bg-white px-3 py-1.5 text-[13px] font-medium text-[#2c3338] shadow-sm hover:bg-[#f6f7f7] disabled:opacity-60"
        >
          <MediaIcon />
          {uploading ? "Uploading…" : "Add Media"}
        </button>

        <div className="flex items-end" role="tablist" aria-label="Editor mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "visual"}
            onClick={switchToVisual}
            className={`relative -mb-px border px-4 py-2 text-[13px] font-medium ${
              mode === "visual"
                ? "border-[#c3c4c7] border-b-white bg-white text-[#1d2327]"
                : "border-transparent bg-transparent text-[#50575e] hover:text-[#1d2327]"
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "text"}
            onClick={switchToText}
            className={`relative -mb-px border px-4 py-2 text-[13px] font-medium ${
              mode === "text"
                ? "border-[#c3c4c7] border-b-white bg-white text-[#1d2327]"
                : "border-transparent bg-transparent text-[#50575e] hover:text-[#1d2327]"
            }`}
          >
            Text
          </button>
        </div>
      </div>

      <div className={mode === "visual" ? "block bg-white" : "hidden"}>
        <div className="wp-tinymce [&_.tox-tinymce]:!rounded-none [&_.tox-tinymce]:border-0 [&_.tox-edit-area__iframe]:!rounded-none [&_.tox-editor-header]:shadow-none [&_.tox-toolbar-overlord]:bg-[#f6f7f7] [&_.tox-toolbar__primary]:bg-[#f6f7f7] [&_.tox-statusbar]:border-t [&_.tox-statusbar]:border-[#dcdcde] [&_.tox-statusbar]:bg-[#f6f7f7] [&_.tox]:!rounded-none">
          <Editor
            key={kitchenSink ? "sink-on" : "sink-off"}
            licenseKey="gpl"
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            value={value}
            onInit={(_evt, editor) => {
              editorRef.current = editor;
            }}
            onEditorChange={(html) => onChange(html)}
            init={init as never}
          />
        </div>
      </div>

      {mode === "text" && (
        <div className="bg-white">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="min-h-[420px] w-full resize-y border-0 bg-white px-4 py-3 font-mono text-[13px] leading-6 text-[#1e1e1e] outline-none"
            placeholder="HTML content…"
          />
          <div className="flex items-center justify-between border-t border-[#dcdcde] bg-[#f6f7f7] px-3 py-1.5 text-[12px] text-[#50575e]">
            <span>HTML source</span>
            <span>Word count: {textWordCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}
