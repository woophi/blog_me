import * as React from 'react';
import './quill.css';
import ReactQuill, { Quill } from 'react-quill';
import { Image } from './Image';
import { ModalUpload } from 'ui/cells/uploader';
import { deselectFile } from 'ui/cells/uploader/operations';
import { useSelector } from 'react-redux';
import { getSelectedFile } from 'core/selectors';

type Props = {
  onChange: (e: any) => void;
  onBlur: (e: any) => void;
  onFocus: (e: any) => void;
  value: any;
};

Quill.register(Image);

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote'],
  ['image', 'code-block', 'link'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

export const QuillEditor = React.memo<Props>(
  ({ onChange, value, onFocus, onBlur }) => {
    const quillRef = React.useRef<ReactQuill>();
    const selectedFile = useSelector(getSelectedFile);
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClickClose = () => {
      setOpen(false);
      deselectFile();
    };
    const handleConfirm = () => {
      setOpen(false);
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      editor.insertEmbed(
        range.index,
        'image',
        {
          url: selectedFile.url,
          alt: selectedFile.name,
        },
        'user'
      );
    };
    const imageHandler = React.useCallback(() => {
      if (!quillRef.current) return;
      handleClickOpen();
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
          image: imageHandler,
        },
      }),
      []
    );
    if (ReactQuill === null) return null;

    return (
      <>
        <ReactQuill
          id="fuck-it"
          ref={(el) => (quillRef.current = el)}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          modules={{
            toolbar,
          }}
        />
        <ModalUpload
          onConfirm={handleConfirm}
          onClose={handleClickClose}
          open={open}
        />
      </>
    );
  }
);
