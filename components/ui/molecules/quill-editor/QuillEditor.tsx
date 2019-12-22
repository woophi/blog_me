import * as React from 'react';
import 'react-quill/dist/quill.snow.css';

let ReactQuill = null;

if (typeof window !== 'undefined') {
  ReactQuill = require('react-quill');
}

type Props = {
  onChange: (e: any) => void;
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

export const QuillEditor = React.memo<Props>(({ onChange, value }) => {
  const quillRef = React.useRef<any>();
  const imageHandler = () => {
    if (!quillRef.current) return;
    const range = quillRef.current.getEditor().getSelection();
    const value = prompt('What is the image URL');
    if (value) {
      quillRef.current.getEditor().insertEmbed(range.index, 'image', value, 'user');
    }
  };
  if (ReactQuill === null) return null;
  return (
    <ReactQuill
      ref={el => (quillRef.current = el)}
      value={value}
      onChange={onChange}
      modules={{
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: imageHandler
          }
        }
      }}
    />
  );
});
