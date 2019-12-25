import * as React from 'react';
import 'react-quill/dist/quill.snow.css';

let ReactQuill = null;

if (typeof window !== 'undefined') {
  ReactQuill = require('react-quill');
}

type Props = {
  onChange: (e: any) => void;
  onBlur: (e: any) => void;
  onFocus: (e: any) => void;
  value: any;
};

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  ['image', 'code-block', 'link'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'] // remove formatting button
];

export const QuillEditor = React.memo<Props>(
  ({ onChange, value, onFocus, onBlur }) => {
    const quillRef = React.useRef<any>();
    const imageHandler = React.useCallback(() => {
      if (!quillRef.current) return;
      const range = quillRef.current.getEditor().getSelection();
      const value = prompt('What is the image URL');
      if (value) {
        quillRef.current
          .getEditor()
          .insertEmbed(range.index, 'image', value, 'user');
      }
    }, [quillRef.current]);

    const handleChange = React.useCallback(
      (textHTML: string, delta: any, source: string, editor: any) => {
        if (!onChange || source !== 'user') {
          return;
        }
        const text = editor.getText();
        if (!text) {
          textHTML = '';
        }

        onChange(textHTML);
      },
      [onChange]
    );

    const toolbar = React.useMemo(
      () => ({
        container: toolbarOptions,
        handlers: {
          image: imageHandler
        }
      }),
      []
    );
    if (ReactQuill === null) return null;

    return (
      <ReactQuill
        id="fuck-it"
        ref={el => (quillRef.current = el)}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        modules={{
          toolbar
        }}
      />
    );
  }
);
