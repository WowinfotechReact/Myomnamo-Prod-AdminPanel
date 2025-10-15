import React from 'react';
import JoditEditor from 'jodit-react';

const editorConfig = {
  minHeight: '300px',
  // toolbarSticky: true,
  maxlength: 10, // Set your max character limit (adjust as needed)

  uploader: {
    insertImageAsBase64URI: true,
    enter: 'DIV',
    direction: 'ltr'
  },
  activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about'],
  disablePlugins: ['paste', 'stat'],
  askBeforePasteHTML: true, // Prevents the link popup model from auto shutdown
  buttons:
    'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,lineHeight,' +
    'superscript,subscript,classSpan,file,image,video,speechRecognize,spellcheck,' +
    'table,source,fullsize,about,outdent,indent,print,cut,selectall',

  // ✅ keep this INSIDE the config object
  defaultStyle: {
    table: 'border:1px solid #000;border-collapse:collapse;'
  }
};

export default function Text_Editor({ editorState, handleContentChange }) {
  return (
    <JoditEditor
      value={editorState}
      onBlur={handleContentChange}
      config={editorConfig}
    />
  );
}
